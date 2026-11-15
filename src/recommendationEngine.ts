import { ContentRecord, BlockRule, DateFilterState, RecommendationStrategy, ScoredRecommendation, UserInteraction } from './types';
import { SUBCATEGORIES, getCategoryById, getAffinityCategories } from './taxonomy';
import { shouldBlock } from './store';

// Helper: Check if a timestamp falls within the date filter
export function isWithinDateFilter(timestamp: number, dateFilter: DateFilterState): boolean {
  const now = Date.now();
  switch (dateFilter.preset) {
    case 'today':
      return now - timestamp <= 24 * 60 * 60 * 1000;
    case 'week':
      return now - timestamp <= 7 * 24 * 60 * 60 * 1000;
    case 'month':
      return now - timestamp <= 30 * 24 * 60 * 60 * 1000;
    case 'quarter':
      return now - timestamp <= 90 * 24 * 60 * 60 * 1000;
    case 'custom': {
      let valid = true;
      if (dateFilter.startDate) {
        const start = new Date(dateFilter.startDate).setHours(0, 0, 0, 0);
        if (timestamp < start) valid = false;
      }
      if (dateFilter.endDate) {
        const end = new Date(dateFilter.endDate).setHours(23, 59, 59, 999);
        if (timestamp > end) valid = false;
      }
      return valid;
    }
    case 'all':
    default:
      return true;
  }
}

// Compute Category Affinity Map based on user interests
export function computeAffinityScores(
  userTopCategoryIds: number[]
): Map<number, { affinityScore: number; sourceCategoryId: number; sourceName: string }> {
  const affinityMap = new Map<number, { affinityScore: number; sourceCategoryId: number; sourceName: string }>();

  for (const catId of userTopCategoryIds) {
    const parentCat = getCategoryById(catId);
    if (!parentCat) continue;

    const related = getAffinityCategories(catId);
    related.forEach((rel) => {
      if (!userTopCategoryIds.includes(rel.id)) {
        const existing = affinityMap.get(rel.id)?.affinityScore || 0;
        affinityMap.set(rel.id, {
          affinityScore: Math.max(existing, 70),
          sourceCategoryId: catId,
          sourceName: parentCat.name,
        });
      }
    });
  }

  return affinityMap;
}

export interface RecommendationEngineParams {
  records: ContentRecord[];
  rules: BlockRule[];
  interactions: UserInteraction[];
  selectedDomain?: string;
  selectedSubcategoryId?: number;
  dateFilter: DateFilterState;
  strategy: RecommendationStrategy;
  limit?: number;
}

export function rankRecommendations({
  records,
  rules,
  interactions,
  selectedDomain,
  selectedSubcategoryId,
  dateFilter,
  strategy = 'hybrid',
  limit = 12,
}: RecommendationEngineParams): ScoredRecommendation[] {
  // 1. Build interaction & category frequency
  const interactionWeights = new Map<string, number>();
  const categoryInterestScores = new Map<string, number>();
  const categoryIdScores = new Map<number, number>();

  // Tally interactions
  for (const inter of interactions) {
    let weight = 1;
    if (inter.type === 'like') weight = 4;
    else if (inter.type === 'save') weight = 3;
    else if (inter.type === 'view') weight = 1.5;
    else if (inter.type === 'dismiss') weight = -10;

    interactionWeights.set(inter.videoId, (interactionWeights.get(inter.videoId) || 0) + weight);

    if (inter.categoryName) {
      categoryInterestScores.set(
        inter.categoryName,
        (categoryInterestScores.get(inter.categoryName) || 0) + weight * 5
      );
    }
    if (inter.categoryId) {
      categoryIdScores.set(
        inter.categoryId,
        (categoryIdScores.get(inter.categoryId) || 0) + weight * 5
      );
    }
  }

  // Tally overall watched records if interaction store is fresh
  for (const r of records) {
    categoryInterestScores.set(
      r.category,
      (categoryInterestScores.get(r.category) || 0) + 1
    );
    if (r.subcategoryId) {
      categoryIdScores.set(
        r.subcategoryId,
        (categoryIdScores.get(r.subcategoryId) || 0) + 1
      );
    }
  }

  // Find top categories
  const sortedCatIds = Array.from(categoryIdScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  const affinityMap = computeAffinityScores(sortedCatIds);

  // 2. Filter records
  const now = Date.now();
  const eligibleRecords = records.filter((r) => {
    // Exclude blocked content
    if (shouldBlock(r, rules)) return false;

    // Filter by Date
    if (!isWithinDateFilter(r.timestamp, dateFilter)) return false;

    // Filter by Domain (Level 1)
    if (selectedDomain && selectedDomain !== 'all') {
      if (r.domain && r.domain.toLowerCase() !== selectedDomain.toLowerCase()) {
        return false;
      }
    }

    // Filter by Subcategory (Level 2)
    if (selectedSubcategoryId && selectedSubcategoryId !== 0) {
      if (r.subcategoryId !== selectedSubcategoryId) {
        return false;
      }
    }

    return true;
  });

  // 3. Score records based on chosen strategy
  const scoredList: ScoredRecommendation[] = eligibleRecords.map((r) => {
    let score = 30; // base score
    let reason = 'Curated for your developer profile';
    let matchType: 'content' | 'affinity' | 'interaction' | 'trending' = 'content';
    let affinitySourceCategory: string | undefined;

    const directCategoryScore = categoryInterestScores.get(r.category) || 0;
    const directCatIdScore = r.subcategoryId ? categoryIdScores.get(r.subcategoryId) || 0 : 0;
    const affinityData = r.subcategoryId ? affinityMap.get(r.subcategoryId) : undefined;
    const interactionScore = interactionWeights.get(r.videoId) || 0;

    // Recency factor calculation (0 to 1)
    const ageDays = Math.max(0, (now - r.timestamp) / (1000 * 60 * 60 * 24));
    const recencyBonus = Math.max(0, 20 * Math.exp(-ageDays / 14)) * dateFilter.recencyWeight;

    // Popularity factor (0 to 15)
    const popBonus = Math.min(15, Math.log10(r.viewCount || 1000) * 2.5);

    switch (strategy) {
      case 'trending': {
        score = popBonus * 3 + recencyBonus * 2.5 + (r.likes ? Math.log10(r.likes) * 3 : 0);
        reason = `🔥 Trending with ${(r.viewCount || 0).toLocaleString()} views`;
        matchType = 'trending';
        break;
      }

      case 'affinity': {
        if (affinityData) {
          score = 50 + affinityData.affinityScore * 0.4 + recencyBonus;
          reason = `✨ Affinity Pick • Related to your interest in ${affinityData.sourceName}`;
          matchType = 'affinity';
          affinitySourceCategory = affinityData.sourceName;
        } else if (directCatIdScore > 0) {
          score = 40 + directCatIdScore * 2 + recencyBonus;
          reason = `Direct match with ${r.category}`;
          matchType = 'content';
        } else {
          score = 25 + popBonus + recencyBonus;
          reason = `Discovered in ${r.domain || r.category}`;
          matchType = 'content';
        }
        break;
      }

      case 'collaborative': {
        if (interactionScore > 0 || r.isLiked || r.isSaved) {
          score = 60 + interactionScore * 5 + popBonus;
          reason = r.isLiked
            ? '❤️ You liked this content'
            : r.isSaved
            ? '🔖 In your saved bookmarks'
            : 'Based on your positive interactions';
          matchType = 'interaction';
        } else if (directCategoryScore > 0) {
          score = 40 + directCategoryScore * 2 + popBonus;
          reason = `Matches your frequent topic: ${r.category}`;
          matchType = 'content';
        } else {
          score = 20 + popBonus;
          reason = 'Popular across similar developer profiles';
          matchType = 'trending';
        }
        break;
      }

      case 'groq':
      case 'hybrid':
      default: {
        if (interactionScore > 0 || r.isLiked || r.isSaved) {
          score = 65 + interactionScore * 3 + recencyBonus;
          reason = r.isLiked
            ? '❤️ Top recommendation from your liked topics'
            : '⭐ Highly aligned with your engagement history';
          matchType = 'interaction';
        } else if (directCategoryScore > 3 || directCatIdScore > 3) {
          score = 55 + Math.min(25, directCategoryScore * 2) + recencyBonus + popBonus * 0.5;
          reason = `🎯 ${Math.min(99, Math.round(score))}% Match • Matches your interest in ${r.category}`;
          matchType = 'content';
        } else if (affinityData) {
          score = 50 + affinityData.affinityScore * 0.35 + recencyBonus + popBonus * 0.5;
          reason = `💡 Suggested affinity • Related to your work in ${affinityData.sourceName}`;
          matchType = 'affinity';
          affinitySourceCategory = affinityData.sourceName;
        } else {
          score = 30 + popBonus + recencyBonus;
          reason = `Top rated video in ${r.domain || 'Software Development'}`;
          matchType = 'trending';
        }
        break;
      }
    }

    // Clamp score to 1-99%
    const finalScore = Math.min(99, Math.max(15, Math.round(score)));

    return {
      ...r,
      score: finalScore,
      reason,
      matchType,
      affinitySourceCategory,
    };
  });

  // Sort by score descending and return up to limit
  return scoredList.sort((a, b) => b.score - a.score).slice(0, limit);
}

