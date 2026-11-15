// Ultra-Fast In-Memory Search Engine with Instant YouTube Redirection & Alias Expansion
import { ContentRecord } from './types';
import { extractYouTubeVideoId } from './universalYouTubeSearch';

export interface SearchResult {
  record: ContentRecord;
  relevanceScore: number;
  highlightField: 'title' | 'category' | 'channel' | 'domain' | 'tag' | 'direct';
  directYouTubeUrl: string;
}

const COMMON_ALIASES: Record<string, string[]> = {
  '100s': ['100', 'seconds', '100s', '100 seconds'],
  '100seconds': ['100', 'seconds', '100s', '100 seconds'],
  'k8s': ['kubernetes', 'k8s', 'containers'],
  'docker': ['docker', 'containers', 'containerization'],
  'py': ['python', 'py'],
  'python': ['python', 'py'],
  'js': ['javascript', 'js'],
  'ts': ['typescript', 'ts'],
  'ml': ['machine learning', 'ml', 'deep learning'],
  'ai': ['artificial intelligence', 'generative ai', 'llm', 'ai', 'karpathy'],
  'react': ['react', 'react 19', 'reactjs'],
  'k8': ['kubernetes'],
  'db': ['database', 'sql', 'postgres', 'mongodb'],
};

export class RealtimeSearchEngine {
  private records: ContentRecord[] = [];
  private recordMap: Map<string, ContentRecord> = new Map();

  constructor(initialRecords: ContentRecord[] = []) {
    this.indexRecords(initialRecords);
  }

  public indexRecords(records: ContentRecord[]) {
    this.records = records;
    this.recordMap.clear();
    for (const r of records) {
      this.recordMap.set(r.id, r);
    }
  }

  private extractTokens(text: string): string[] {
    const rawTokens = text
      .toLowerCase()
      .replace(/[^\w\s#-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 2);

    const expanded = new Set<string>(rawTokens);
    for (const tok of rawTokens) {
      const cleanTok = tok.replace(/^-+|-+$/g, '');
      if (COMMON_ALIASES[cleanTok]) {
        for (const alias of COMMON_ALIASES[cleanTok]) {
          expanded.add(alias);
        }
      }
    }
    return Array.from(expanded);
  }

  // Real-time search returning ranked matches in < 1ms
  public search(query: string, limit: number = 8): SearchResult[] {
    if (!query || !query.trim()) {
      return this.records.slice(0, limit).map((r) => ({
        record: r,
        relevanceScore: 10,
        highlightField: 'title',
        directYouTubeUrl: r.url || `https://www.youtube.com/watch?v=${r.videoId}`,
      }));
    }

    const cleanQ = query.trim().toLowerCase();
    const directId = extractYouTubeVideoId(query);

    // Direct YouTube URL or Video ID match
    if (directId) {
      const directMatch = this.records.find((r) => r.videoId === directId);
      if (directMatch) {
        return [
          {
            record: directMatch,
            relevanceScore: 99999,
            highlightField: 'direct',
            directYouTubeUrl: directMatch.url || `https://www.youtube.com/watch?v=${directMatch.videoId}`,
          },
          ...this.search('', limit - 1).filter((r) => r.record.id !== directMatch.id),
        ];
      }
    }

    const queryTerms = cleanQ.split(/\s+/).filter((t) => t.length > 0);
    const queryTokens = this.extractTokens(cleanQ);
    const scores = new Map<string, { score: number; field: 'title' | 'category' | 'channel' | 'domain' | 'tag' | 'direct' }>();

    for (const r of this.records) {
      let score = 0;
      let field: 'title' | 'category' | 'channel' | 'domain' | 'tag' | 'direct' = 'title';

      const titleLower = r.title.toLowerCase();
      const catLower = r.category.toLowerCase();
      const chanLower = r.channel.toLowerCase();
      const domLower = (r.domain || '').toLowerCase();
      const tagsJoined = (r.tags || []).join(' ').toLowerCase();
      const allText = `${titleLower} ${chanLower} ${catLower} ${domLower} ${tagsJoined} ${r.videoId.toLowerCase()}`;

      // 1. Direct Video ID match
      if (directId && r.videoId.toLowerCase() === directId.toLowerCase()) {
        score += 5000;
        field = 'direct';
      }

      // 2. Full exact substring matches
      if (titleLower.includes(cleanQ)) {
        score += titleLower.startsWith(cleanQ) ? 200 : 150;
        field = 'title';
      } else if (catLower.includes(cleanQ)) {
        score += 120;
        field = 'category';
      } else if (chanLower.includes(cleanQ)) {
        score += 100;
        field = 'channel';
      } else if (domLower.includes(cleanQ)) {
        score += 80;
        field = 'domain';
      } else if (tagsJoined.includes(cleanQ)) {
        score += 90;
        field = 'tag';
      }

      // 3. Multi-word phrase matching with alias coverage (e.g. "Docker in 100s")
      let matchedTermsCount = 0;
      for (const term of queryTerms) {
        const termAliases = COMMON_ALIASES[term] || [term];
        const termMatches = termAliases.some((alias) => allText.includes(alias));
        if (termMatches) {
          matchedTermsCount++;
        }
      }

      if (queryTerms.length > 1 && matchedTermsCount === queryTerms.length) {
        // Every single word from the query matched!
        score += 180;
      } else if (matchedTermsCount > 0) {
        score += matchedTermsCount * 25;
      }

      // 4. Token overlap matches
      for (const qt of queryTokens) {
        if (titleLower.includes(qt)) score += 20;
        if (catLower.includes(qt)) score += 15;
        if (chanLower.includes(qt)) score += 12;
        if (tagsJoined.includes(qt)) score += 18;
      }

      // 5. Popularity boost (logarithmic views)
      if (score > 0 && r.viewCount) {
        score += Math.min(20, Math.log10(r.viewCount) * 2.5);
      }

      if (score > 0) {
        scores.set(r.id, { score, field });
      }
    }

    const sorted = Array.from(scores.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, limit)
      .map(([id, s]) => {
        const record = this.recordMap.get(id)!;
        const directYouTubeUrl =
          record.url || `https://www.youtube.com/watch?v=${record.videoId}`;
        return {
          record,
          relevanceScore: Math.round(s.score),
          highlightField: s.field,
          directYouTubeUrl,
        };
      });

    return sorted;
  }

  // Find single best match for instant 1-click redirect
  public getTopMatch(query: string): SearchResult | null {
    const results = this.search(query, 1);
    return results.length > 0 ? results[0] : null;
  }
}
