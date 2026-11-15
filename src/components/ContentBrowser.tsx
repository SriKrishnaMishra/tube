import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  Play,
  Clock,
  User,
  Eye,
  ShieldCheck,
  Globe,
  ExternalLink,
  Zap,
  Loader2,
  Sparkles,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { ContentRecord, DateFilterState } from '../types';
import { DOMAINS, getCategoriesByDomain } from '../taxonomy';
import { DateFilterBar } from './DateFilterBar';
import { isWithinDateFilter } from '../recommendationEngine';
import {
  extractYouTubeVideoId,
  searchUniversalYouTube,
  fetchYouTubeOEmbed,
  generateIntelligentFallbackCards,
} from '../universalYouTubeSearch';

interface ContentBrowserProps {
  records: ContentRecord[];
  onPlayInModal?: (record: ContentRecord) => void;
  onDeleteRecord?: (id: string) => void;
  onRestoreRecord?: (id: string) => void;
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
  'db': ['database', 'sql', 'postgres', 'mongodb'],
};

export function ContentBrowser({
  records,
  onPlayInModal,
  onDeleteRecord,
  onRestoreRecord,
}: ContentBrowserProps) {
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    preset: 'all',
    recencyWeight: 0.5,
  });

  // Deleted Videos State
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deleted-video-ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [deleteToast, setDeleteToast] = useState<{ id: string; title: string } | null>(null);

  const deletedSet = useMemo(() => new Set(deletedIds), [deletedIds]);

  const handleDeleteVideo = (id: string, title: string) => {
    setDeletedIds((prev) => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      try {
        localStorage.setItem('deleted-video-ids', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save deleted ids', e);
      }
      return updated;
    });

    if (onDeleteRecord) {
      onDeleteRecord(id);
    }

    setDeleteToast({ id, title });
    setTimeout(() => {
      setDeleteToast((cur) => (cur?.id === id ? null : cur));
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (!deleteToast) return;
    const targetId = deleteToast.id;
    setDeletedIds((prev) => {
      const updated = prev.filter((x) => x !== targetId);
      try {
        localStorage.setItem('deleted-video-ids', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not restore id', e);
      }
      return updated;
    });

    if (onRestoreRecord) {
      onRestoreRecord(targetId);
    }
    setDeleteToast(null);
  };

  // Live YouTube Universal Search State
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveYouTubeRecords, setLiveYouTubeRecords] = useState<ContentRecord[]>([]);
  const [detectedDirectVideo, setDetectedDirectVideo] = useState<{
    id: string;
    title: string;
    channel: string;
  } | null>(null);

  // Combine local catalog records with any live fetched YouTube records, excluding deleted
  const allRecords = useMemo(() => {
    return [...liveYouTubeRecords, ...records].filter(
      (r) => !deletedSet.has(r.id) && !deletedSet.has(r.videoId)
    );
  }, [liveYouTubeRecords, records, deletedSet]);

  const channels = useMemo(() => {
    return Array.from(new Set(allRecords.map((r) => r.channel))).sort();
  }, [allRecords]);

  // Instant Direct YouTube URL / Video ID detector
  const handleSearchChange = async (val: string) => {
    setSearch(val);

    const directId = extractYouTubeVideoId(val);
    if (directId) {
      setDetectedDirectVideo({
        id: directId,
        title: directId === 'JuyaVIK-kGQ' ? 'Full Stack Development & System Design Deep Dive' : `YouTube Video (${directId})`,
        channel: directId === 'JuyaVIK-kGQ' ? 'ByteByteGo' : 'YouTube Creator',
      });

      const meta = await fetchYouTubeOEmbed(directId);
      if (meta) {
        setDetectedDirectVideo({
          id: directId,
          title: meta.title,
          channel: meta.author,
        });
      }
    } else {
      setDetectedDirectVideo(null);
    }
  };

  // Perform Live YouTube Search across all of YouTube
  const handleLiveYouTubeSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery || search).trim();
    if (!q) return;

    setIsSearchingLive(true);
    try {
      const results = await searchUniversalYouTube(q);
      if (results.length > 0) {
        setLiveYouTubeRecords((prev) => {
          const existingIds = new Set(prev.map((r) => r.videoId));
          const newItems = results.filter((r) => !existingIds.has(r.videoId));
          return [...newItems, ...prev];
        });
      }
    } catch (err) {
      console.warn('Live YouTube Search error:', err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handlePlayDirectVideo = () => {
    if (!detectedDirectVideo) return;
    const directRecord: ContentRecord = {
      id: `direct-${detectedDirectVideo.id}-${Date.now()}`,
      videoId: detectedDirectVideo.id,
      url: `https://www.youtube.com/watch?v=${detectedDirectVideo.id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${detectedDirectVideo.id}/hqdefault.jpg`,
      title: detectedDirectVideo.title,
      channel: detectedDirectVideo.channel,
      domain: 'Universal YouTube',
      category: 'Direct URL Search',
      subcategoryId: 1,
      timestamp: Date.now(),
      source: 'search',
      duration: 600,
      viewCount: 150000,
      likes: 8000,
      tags: ['youtube', 'custom-video'],
    };

    if (onPlayInModal) {
      onPlayInModal(directRecord);
    } else {
      window.open(directRecord.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Intelligent ranked fuzzy search across all 57 categories, channels, and domains
  const filtered = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();
    const searchTerms = cleanSearch ? cleanSearch.split(/\s+/).filter(Boolean) : [];
    const directSearchId = cleanSearch ? extractYouTubeVideoId(cleanSearch) : null;

    // Base pass: filter out deleted items
    const nonDeleted = allRecords.filter(
      (r) => !deletedSet.has(r.id) && !deletedSet.has(r.videoId)
    );

    // If no search query, apply standard filters
    if (!cleanSearch) {
      return nonDeleted.filter((r) => {
        const matchesDomain = !selectedDomain || r.domain === selectedDomain;
        const matchesCategory = !selectedCategory || r.category === selectedCategory;
        const matchesChannel = !selectedChannel || r.channel === selectedChannel;
        const matchesDuration =
          !selectedDuration ||
          (selectedDuration === 'short' && (r.duration || 0) <= 300) ||
          (selectedDuration === 'medium' && (r.duration || 0) > 300 && (r.duration || 0) <= 1200) ||
          (selectedDuration === 'long' && (r.duration || 0) > 1200);
        const matchesDate = isWithinDateFilter(r.timestamp, dateFilter);
        return matchesDomain && matchesCategory && matchesChannel && matchesDuration && matchesDate;
      });
    }

    // Direct YouTube Video ID or URL
    if (directSearchId) {
      const match = nonDeleted.find(
        (r) => r.videoId.toLowerCase() === directSearchId.toLowerCase()
      );
      if (match) return [match];
    }

    // Ranked scoring for query search
    const scored: { record: ContentRecord; score: number }[] = [];

    for (const r of nonDeleted) {
      const titleLower = r.title.toLowerCase();
      const chanLower = r.channel.toLowerCase();
      const domLower = (r.domain || '').toLowerCase();
      const catLower = (r.category || '').toLowerCase();
      const tagsJoined = (r.tags || []).join(' ').toLowerCase();
      const fullText = `${titleLower} ${chanLower} ${domLower} ${catLower} ${tagsJoined} ${r.videoId.toLowerCase()}`;

      let score = 0;

      // 1. Full exact substring
      if (fullText.includes(cleanSearch)) {
        score += 200;
        if (titleLower.includes(cleanSearch)) score += 80;
        if (chanLower.includes(cleanSearch)) score += 60;
      }

      // 2. Multi-word phrase matching with alias coverage
      let matchedTermsCount = 0;
      for (const term of searchTerms) {
        const termAliases = COMMON_ALIASES[term] || [term];
        const termMatches = termAliases.some((alias) => fullText.includes(alias));
        if (termMatches) {
          matchedTermsCount++;
          if (termAliases.some((alias) => titleLower.includes(alias))) score += 30;
          if (termAliases.some((alias) => chanLower.includes(alias))) score += 30;
        }
      }

      if (searchTerms.length > 0) {
        const matchRatio = matchedTermsCount / searchTerms.length;
        if (matchedTermsCount === searchTerms.length) {
          // Every word matched!
          score += 160;
        } else if (matchRatio >= 0.5) {
          // At least half of terms matched
          score += matchRatio * 90;
        } else if (matchedTermsCount > 0) {
          score += matchedTermsCount * 25;
        }
      }

      // 3. Optional dropdown filtering
      let passesDropdowns = true;
      if (selectedDomain && r.domain !== selectedDomain) passesDropdowns = false;
      if (selectedCategory && r.category !== selectedCategory) passesDropdowns = false;
      if (selectedChannel && r.channel !== selectedChannel) passesDropdowns = false;
      if (selectedDuration) {
        const dur = r.duration || 0;
        if (selectedDuration === 'short' && dur > 300) passesDropdowns = false;
        if (selectedDuration === 'medium' && (dur <= 300 || dur > 1200)) passesDropdowns = false;
        if (selectedDuration === 'long' && dur <= 1200) passesDropdowns = false;
      }

      if (score > 0 && passesDropdowns) {
        scored.push({ record: r, score });
      }
    }

    // If dropdowns filtered out everything, fallback without dropdown restrictions
    if (scored.length === 0 && (selectedDomain || selectedCategory || selectedChannel || selectedDuration)) {
      for (const r of nonDeleted) {
        const titleLower = r.title.toLowerCase();
        const chanLower = r.channel.toLowerCase();
        const tagsJoined = (r.tags || []).join(' ').toLowerCase();
        const fullText = `${titleLower} ${chanLower} ${(r.domain || '').toLowerCase()} ${(r.category || '').toLowerCase()} ${tagsJoined}`;

        let score = 0;
        if (fullText.includes(cleanSearch)) score += 120;
        for (const term of searchTerms) {
          if (fullText.includes(term)) score += 30;
        }
        if (score > 0) {
          scored.push({ record: r, score });
        }
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.record);
  }, [allRecords, search, selectedDomain, selectedCategory, selectedChannel, selectedDuration, dateFilter, deletedSet]);

  // Fallback intelligent cards when local filtered list is empty
  const fallbackCards = useMemo(() => {
    if (filtered.length > 0 || !search.trim()) return [];
    return generateIntelligentFallbackCards(search).filter(
      (r) => !deletedSet.has(r.id) && !deletedSet.has(r.videoId)
    );
  }, [filtered.length, search, deletedSet]);

  const displayRecords = filtered.length > 0 ? filtered : fallbackCards;

  const clearFilters = () => {
    setSearch('');
    setSelectedDomain('');
    setSelectedCategory('');
    setSelectedChannel('');
    setSelectedDuration('');
    setDetectedDirectVideo(null);
    setDateFilter({ preset: 'all', recencyWeight: 0.5 });
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(selectedDomain) ||
    Boolean(selectedCategory) ||
    Boolean(selectedChannel) ||
    Boolean(selectedDuration) ||
    dateFilter.preset !== 'all';

  const quickSearchPills = [
    'Docker in 100s',
    'Python Full Course',
    'React 19',
    'Kubernetes Nana',
    'Rust Programming',
    'Andrej Karpathy LLM',
    'Linear Algebra 3Blue1Brown',
    'Quantum Computing',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Introduction */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Developer Content Browser</span>
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          Browse and filter {allRecords.length} videos across 8 domains and 57 software development categories.
        </p>
      </div>

      {/* Date & Recency Filter Bar */}
      <DateFilterBar filter={dateFilter} onChange={setDateFilter} />

      {/* Live Direct Video Detected Banner */}
      {detectedDirectVideo && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900/80 border-2 border-emerald-500/70 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-emerald-400/40 shadow-md">
              <img
                src={`https://i.ytimg.com/vi/${detectedDirectVideo.id}/hqdefault.jpg`}
                alt={detectedDirectVideo.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = `https://img.youtube.com/vi/${detectedDirectVideo.id}/0.jpg`;
                }}
              />
              <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-emerald-600 text-[8px] font-bold text-white uppercase">
                Ad-Free
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                  <Sparkles size={10} />
                  DIRECT YOUTUBE LINK DETECTED
                </span>
                <span className="text-[10px] text-gray-400 font-mono">ID: {detectedDirectVideo.id}</span>
              </div>
              <h3 className="text-sm font-bold text-white truncate">{detectedDirectVideo.title}</h3>
              <p className="text-xs text-emerald-300/80 mt-0.5">{detectedDirectVideo.channel}</p>
            </div>
          </div>

          <button
            onClick={handlePlayDirectVideo}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 shrink-0 transition-all transform active:scale-95 cursor-pointer"
          >
            <Play size={14} fill="white" />
            <span>Play Ad-Free in Portal</span>
          </button>
        </div>
      )}

      {/* Universal Search Bar & Controls */}
      <div className="space-y-2.5">
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (detectedDirectVideo) {
                    handlePlayDirectVideo();
                  } else {
                    handleLiveYouTubeSearch();
                  }
                }
              }}
              placeholder="Search across 57 categories, domains, titles, or paste YouTube link..."
              className="w-full pl-10 pr-36 sm:pr-48 py-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-300 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
            />

            {/* Action buttons inside search input */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {search.trim() && (
                <button
                  onClick={() => {
                    setSearch('');
                    setDetectedDirectVideo(null);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}

              {search.trim() && (
                <button
                  onClick={() => handleLiveYouTubeSearch()}
                  disabled={isSearchingLive}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer"
                  title="Search entire YouTube library for this query"
                >
                  {isSearchingLive ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Globe size={13} />
                  )}
                  <span className="hidden sm:inline">Search YouTube</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-2xl border flex items-center gap-2 text-sm font-semibold transition-all cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-white/[0.03] border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.06] shadow-sm'
            }`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
          </button>
        </div>

        {/* Quick Search Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium shrink-0 flex items-center gap-1">
            <Zap size={11} className="text-amber-400" />
            Quick:
          </span>
          {quickSearchPills.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                setSearch(pill);
                handleSearchChange(pill);
              }}
              className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-indigo-50 dark:bg-white/5 dark:hover:bg-indigo-600/20 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white border border-gray-200 dark:border-white/10 shrink-0 text-[11px] transition-colors font-medium cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Drawer */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 backdrop-blur-xl animate-in fade-in duration-150 shadow-sm">
          {/* Domain Filter */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 block font-medium">Domain (Level 1)</label>
            <select
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setSelectedCategory('');
              }}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-gray-200 outline-none focus:border-indigo-400"
            >
              <option value="">All 8 Domains</option>
              {DOMAINS.map((dom) => (
                <option key={dom.id} value={dom.name}>
                  {dom.icon} {dom.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 block font-medium">Category (Level 2)</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-gray-200 outline-none focus:border-indigo-400"
            >
              <option value="">All 57 Categories</option>
              {DOMAINS.map((dom) => {
                const subcats = getCategoriesByDomain(dom.id);
                return (
                  <optgroup key={dom.id} label={`${dom.icon} ${dom.name}`}>
                    {subcats.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        #{cat.id} {cat.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 block font-medium">Channel</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-gray-200 outline-none focus:border-indigo-400"
            >
              <option value="">All Channels</option>
              {channels.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 block font-medium">Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-300 dark:border-white/10 text-xs text-gray-900 dark:text-gray-200 outline-none focus:border-indigo-400"
            >
              <option value="">Any Duration</option>
              <option value="short">Short (&lt; 5 min)</option>
              <option value="medium">Medium (5-20 min)</option>
              <option value="long">Long (&gt; 20 min)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="sm:col-span-2 md:col-span-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-xs text-gray-800 dark:text-gray-200 transition-colors font-medium cursor-pointer"
              >
                <X size={12} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count & Universal Live Search Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
        <p>
          Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> of {allRecords.length} videos
          {liveYouTubeRecords.length > 0 && (
            <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              (+{liveYouTubeRecords.length} live YouTube results)
            </span>
          )}
        </p>

        {search.trim() && (
          <button
            onClick={() => handleLiveYouTubeSearch()}
            disabled={isSearchingLive}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {isSearchingLive ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Globe size={12} />
            )}
            <span>Search live YouTube for &quot;{search}&quot;</span>
          </button>
        )}
      </div>

      {/* Content Grid */}
      {displayRecords.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 dark:border-white/15 rounded-3xl bg-gray-50/50 dark:bg-white/[0.01] p-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-500 dark:text-indigo-400">
            <Search size={28} />
          </div>
          <div>
            <p className="text-base text-gray-900 dark:text-gray-100 font-bold">
              {search ? (
                <>No catalog matches for &quot;{search}&quot;</>
              ) : (
                <>No videos match active filter ({dateFilter.preset.toUpperCase()})</>
              )}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto">
              {search
                ? 'Search the entire live YouTube database directly or paste any video link to watch it ad-free.'
                : 'Click "Show All Time" to view the complete catalog of masterclasses and videos.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {search ? (
              <button
                onClick={() => handleLiveYouTubeSearch()}
                disabled={isSearchingLive}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSearchingLive ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
                <span>Search All of YouTube for &quot;{search}&quot;</span>
              </button>
            ) : (
              <button
                onClick={() => setDateFilter((prev) => ({ ...prev, preset: 'all' }))}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Globe size={14} />
                <span>Show All Time Videos</span>
              </button>
            )}
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-gray-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 && fallbackCards.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">
                    Direct YouTube Matches for &ldquo;{search}&rdquo; ({fallbackCards.length} curated masterclasses)
                  </p>
                  <p className="text-[11px] text-gray-300">
                    Instantly matched curated high-relevance video courses from YouTube.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleLiveYouTubeSearch()}
                disabled={isSearchingLive}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow shrink-0 cursor-pointer"
              >
                {isSearchingLive ? <Loader2 size={12} className="animate-spin" /> : <Globe size={12} />}
                <span>Search Live YouTube</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayRecords.map((record) => {
              const youtubeUrl =
                record.url ||
                `https://www.youtube.com/watch?v=${record.videoId}`;

              return (
                <div
                  key={record.id}
                  className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/60 hover:bg-gray-50/80 dark:hover:bg-slate-900/90 hover:border-indigo-400/50 hover:shadow-xl dark:hover:shadow-indigo-500/20 transition-all duration-300 p-4 flex flex-col justify-between backdrop-blur-xl shadow-sm"
                >
                  <div>
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        if (onPlayInModal) onPlayInModal(record);
                        else window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full h-40 rounded-xl bg-black/60 overflow-hidden relative mb-3 group-hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <img
                        src={record.thumbnailUrl || `https://i.ytimg.com/vi/${record.videoId}/hqdefault.jpg`}
                        alt={record.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback && record.videoId) {
                            target.dataset.fallback = 'true';
                            target.src = `https://img.youtube.com/vi/${record.videoId}/0.jpg`;
                          } else {
                            target.src =
                              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80';
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                      {/* Ad-Free Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                          <Play size={20} fill="white" className="ml-0.5" />
                        </div>
                      </div>

                      {/* Zero-Ad Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600/95 text-[10px] font-bold text-white shadow flex items-center gap-1 backdrop-blur-sm">
                        <ShieldCheck size={10} />
                        Zero Ads
                      </span>

                      {/* Duration */}
                      {record.duration && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono font-bold text-white shadow">
                          {Math.floor(record.duration / 60)}:{String(record.duration % 60).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Domain & Category Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                      {record.domain && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                          {record.domain}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200">
                        #{record.subcategoryId || 1} {record.category}
                      </span>
                    </div>

                    {/* Title & Channel */}
                    <h3
                      onClick={() => {
                        if (onPlayInModal) onPlayInModal(record);
                        else window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="text-sm font-bold line-clamp-2 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors mb-1.5 leading-snug cursor-pointer"
                    >
                      {record.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-indigo-200/80 mb-3 font-medium">
                      <User size={12} className="text-indigo-500 dark:text-indigo-400" />
                      <span className="truncate">{record.channel}</span>
                    </div>
                  </div>

                  {/* Footer Metadata, Delete Button & Watch Button */}
                  <div className="pt-2.5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    <div className="flex items-center gap-2.5">
                      {record.viewCount && (
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <Eye size={12} className="text-cyan-500 dark:text-cyan-400" />
                          {record.viewCount.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Clock size={12} className="text-amber-500 dark:text-amber-400" />
                        {new Date(record.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVideo(record.id || record.videoId, record.title);
                        }}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete video from portal"
                      >
                        <Trash2 size={13} />
                      </button>

                      {onPlayInModal && (
                        <button
                          onClick={() => onPlayInModal(record)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                          title="Watch without ads in portal modal player"
                        >
                          <Play size={11} fill="currentColor" />
                          <span>Watch Ad-Free</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Undo Delete Toast */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 z-[99999] px-4 py-3 rounded-2xl bg-slate-900 border border-rose-500/50 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <Trash2 size={16} className="text-rose-400 shrink-0" />
          <span className="text-xs font-medium truncate max-w-xs">
            Deleted &ldquo;{deleteToast.title}&rdquo;
          </span>
          <button
            onClick={handleUndoDelete}
            className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-2"
          >
            <RotateCcw size={12} />
            <span>Undo</span>
          </button>
        </div>
      )}
    </div>
  );
}
