import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Play, ExternalLink, X, Flame, ShieldCheck, Globe, Link2, Sparkles, ListVideo, UserCheck } from 'lucide-react';
import { ContentRecord } from '../types';
import { RealtimeSearchEngine, SearchResult } from '../searchEngine';
import { extractYouTubeVideoId, fetchYouTubeOEmbed } from '../universalYouTubeSearch';

interface GlobalSearchProps {
  records: ContentRecord[];
  onPlayInModal?: (record: ContentRecord) => void;
  onOpenCreator?: (creatorName: string) => void;
}

const KNOWN_CREATOR_AVATARS: Record<string, string> = {
  'krish naik': 'https://yt3.googleusercontent.com/r0lRsN4EgVg_h9TfhKoK-oa9SGtmC4QxvwhEYFB4VWoRXtxsQoyhh2WvrRxpxciTYwh4D4_W=s900-c-k-c0x00ffffff-no-rj',
  'piyush garg': 'https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj',
  'fireship': 'https://yt3.googleusercontent.com/3fPNbkf_xPyCleq77ZhcxyeorY97NtMHVNUbaAON_RBDH9ydL4hJkjxC8x_4mpuopkB8oI7Ct6Y=s900-c-k-c0x00ffffff-no-rj',
  'bytebytego': 'https://yt3.googleusercontent.com/ZDRUyBUwc2WXZzvNKP9VS9myI6Mg2puQLaWyp4hibRu-owlsasZ3DVNGSQJwzO1IU-tqoMiGgdc=s900-c-k-c0x00ffffff-no-rj',
  'freecodecamp.org': 'https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s900-c-k-c0x00ffffff-no-rj',
  'freecodecamp': 'https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s900-c-k-c0x00ffffff-no-rj',
  'traversy media': 'https://yt3.googleusercontent.com/ytc/AIdro_mLysKc36lc_FVk2j777olWvLOjgDz6NCNGdiQBnAKRENM=s900-c-k-c0x00ffffff-no-rj',
  'andrej karpathy': 'https://yt3.googleusercontent.com/ytc/AIdro_nDvyq2NoPL626bk1IbxQ94SfQsD-B0qgZchghtQNkLWoEz=s900-c-k-c0x00ffffff-no-rj',
  'andrejkarpathy': 'https://yt3.googleusercontent.com/ytc/AIdro_nDvyq2NoPL626bk1IbxQ94SfQsD-B0qgZchghtQNkLWoEz=s900-c-k-c0x00ffffff-no-rj',
  'chaiaurcode': 'https://yt3.googleusercontent.com/6tLBV-DRVemxhmanuezR5HkHshX2g7Y46Rq8cysyO1V-nd2SaQ2Fi8cdgVM-n6v_8XZ5BEimxXI=s900-c-k-c0x00ffffff-no-rj',
  'chai aur code': 'https://yt3.googleusercontent.com/6tLBV-DRVemxhmanuezR5HkHshX2g7Y46Rq8cysyO1V-nd2SaQ2Fi8cdgVM-n6v_8XZ5BEimxXI=s900-c-k-c0x00ffffff-no-rj',
  'hitesh choudhary': 'https://yt3.googleusercontent.com/6tLBV-DRVemxhmanuezR5HkHshX2g7Y46Rq8cysyO1V-nd2SaQ2Fi8cdgVM-n6v_8XZ5BEimxXI=s900-c-k-c0x00ffffff-no-rj',
  'codewithharry': 'https://yt3.googleusercontent.com/ytc/AIdro_kX3sdbuu3KFmRPsmlu0R5Rx_BhpxwupjtvJmkEdNfla7w=s900-c-k-c0x00ffffff-no-rj',
  'neetcode': 'https://yt3.googleusercontent.com/25g11wkEmSb_ZTC6M5-uMklwAHmFa9rfZN7TzS9WLsfPgXFHoLaegwKwBqqah7pPhQhSafMx=s900-c-k-c0x00ffffff-no-rj',
};

export function GlobalSearch({ records, onPlayInModal, onOpenCreator }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fetchedMeta, setFetchedMeta] = useState<{ title: string; author: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize and memoize high-speed in-memory search engine
  const searchEngine = useMemo(() => {
    return new RealtimeSearchEngine(records);
  }, [records]);

  // Check if query is or contains a YouTube URL or direct 11-char ID
  const directVideoId = useMemo(() => {
    return extractYouTubeVideoId(query);
  }, [query]);

  // Fetch oEmbed title if direct video ID is pasted
  useEffect(() => {
    if (!directVideoId) {
      setFetchedMeta(null);
      return;
    }

    let isMounted = true;
    fetchYouTubeOEmbed(directVideoId).then((meta) => {
      if (isMounted && meta) {
        setFetchedMeta(meta);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [directVideoId]);

  // Real-time instant search matches with direct link prioritization
  const results = useMemo(() => {
    const rawMatches = searchEngine.search(query, 8);

    if (!directVideoId) {
      return rawMatches;
    }

    // Direct YouTube video matched or pasted
    const knownMatch = records.find((r) => r.videoId === directVideoId);

    const directRecord: ContentRecord = {
      id: knownMatch?.id || `direct-${directVideoId}`,
      videoId: directVideoId,
      url: `https://www.youtube.com/watch?v=${directVideoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${directVideoId}/hqdefault.jpg`,
      title:
        fetchedMeta?.title ||
        knownMatch?.title ||
        (directVideoId === 'JuyaVIK-kGQ'
          ? 'Full Stack Development & System Design Deep Dive'
          : `YouTube Video (${directVideoId})`),
      channel:
        fetchedMeta?.author ||
        knownMatch?.channel ||
        (directVideoId === 'JuyaVIK-kGQ' ? 'ByteByteGo / Tech' : 'YouTube Direct Video'),
      domain: knownMatch?.domain || 'Universal Video',
      category: knownMatch?.category || 'Direct Search',
      subcategoryId: knownMatch?.subcategoryId || 1,
      timestamp: knownMatch?.timestamp || Date.now(),
      source: 'search',
      duration: knownMatch?.duration || 720,
      tags: knownMatch?.tags || ['youtube', 'direct-stream'],
    };

    const directItem: SearchResult = {
      record: directRecord,
      relevanceScore: 999999,
      highlightField: 'direct',
      directYouTubeUrl: directRecord.url || `https://www.youtube.com/watch?v=${directVideoId}`,
    };

    // Filter out duplicate if it was already in raw matches and place directItem at #0
    const filteredRaw = rawMatches.filter((r) => r.record.videoId !== directVideoId);
    return [directItem, ...filteredRaw.slice(0, 6)];
  }, [searchEngine, query, directVideoId, records, fetchedMeta]);

  // Check if query matches a known YouTube creator
  const matchedCreator = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;
    const q = query.toLowerCase().trim();

    const creators = [
      { name: 'Andrej Karpathy', handle: '@AndrejKarpathy', domain: 'AI & Machine Learning' },
      { name: 'Krish Naik', handle: '@krishnaik06', domain: 'AI & Machine Learning' },
      { name: 'Piyush Garg', handle: '@piyushgargdev', domain: 'Security & DevOps' },
      { name: 'Fireship', handle: '@fireship', domain: 'Cloud & DevOps' },
      { name: 'ByteByteGo', handle: '@bytebytego', domain: 'Web Development' },
      { name: 'freeCodeCamp.org', handle: '@freecodecamp', domain: 'Full Stack & AI' },
      { name: 'Traversy Media', handle: '@TraversyMedia', domain: 'Web Development' },
      { name: 'Hitesh Choudhary', handle: '@chaiaurcode', domain: 'Programming Languages' },
      { name: 'Chai aur Code', handle: '@chaiaurcode', domain: 'Programming Languages' },
      { name: 'CodeWithHarry', handle: '@CodeWithHarry', domain: 'Full Stack Development' },
      { name: 'NeetCode', handle: '@NeetCode', domain: 'Algorithms & LeetCode' },
      { name: '3Blue1Brown', handle: '@3blue1brown', domain: 'Mathematics & Neural Networks' },
      { name: 'The Coding Train', handle: '@thecodingtrain', domain: 'Creative Coding & JavaScript' },
      { name: 'Linus Tech Tips', handle: '@LinusTechTips', domain: 'Hardware & Systems' },
      { name: 'Computerphile', handle: '@Computerphile', domain: 'Cybersecurity & Math' },
    ];

    const match = creators.find(
      (c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())
    );
    if (match) return match;

    const inRecords = records.find((r) => r.channel.toLowerCase().includes(q));
    if (inRecords) {
      return {
        name: inRecords.channel,
        handle: `@${inRecords.channel.toLowerCase().replace(/\s+/g, '')}`,
        domain: inRecords.domain || 'Software Development',
      };
    }
    return null;
  }, [query, records]);

  // Keyboard shortcut: Ctrl + K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInstantRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  // Handle immediate play or redirect on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        const target = results[selectedIndex] || results[0];
        if (onPlayInModal) {
          onPlayInModal(target.record);
        } else {
          handleInstantRedirect(target.directYouTubeUrl);
        }
      } else if (query.trim()) {
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`;
        window.open(youtubeSearchUrl, '_blank', 'noopener,noreferrer');
      }
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    }
  };

  const quickPills = ['Docker in 100s', 'Python', 'React 19', 'Kubernetes', 'Generative AI', 'Rust', 'Web Crawler'];

  return (
    <div className={`relative w-full max-w-md lg:max-w-lg ${isOpen ? 'z-[9999]' : 'z-20'}`} ref={containerRef}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search
          size={16}
          className={`absolute left-3.5 transition-colors ${
            isOpen ? 'text-indigo-400' : 'text-gray-400'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste ANY YouTube link (e.g. watch?v=...) or search topic..."
          className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-900/95 dark:bg-slate-900/95 bg-white border border-indigo-500/40 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-md"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setFetchedMeta(null);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
              title="Clear search"
            >
              <X size={12} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-gray-400 shadow-sm">
              <span className="text-[9px]">Ctrl</span> K
            </kbd>
          )}

          {query && (
            <button
              onClick={() => {
                if (results.length > 0) {
                  const target = results[0];
                  if (onPlayInModal) {
                    onPlayInModal(target.record);
                  } else {
                    handleInstantRedirect(target.directYouTubeUrl);
                  }
                  setIsOpen(false);
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow active:scale-95"
              title="Play Ad-Free in portal"
            >
              <Play size={10} fill="currentColor" />
              <span>Play</span>
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete & Instant Search Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-indigo-500/40 bg-[#0d0f1e] text-white shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-[9999] overflow-hidden divide-y divide-white/10 opacity-100">
          {/* Quick Filter Chips */}
          <div className="p-2.5 bg-slate-900 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Flame size={12} className="text-amber-400" />
              Quick:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  setQuery(pill);
                  inputRef.current?.focus();
                }}
                className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-white/5 hover:bg-indigo-600/30 text-gray-300 hover:text-white border border-white/5 hover:border-indigo-400/40 transition-colors whitespace-nowrap"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Matching YouTube Creator Channel Banner */}
          {matchedCreator && (
            <div
              onClick={() => {
                if (onOpenCreator) {
                  onOpenCreator(matchedCreator.name);
                  setIsOpen(false);
                }
              }}
              className="m-2 p-3 rounded-xl bg-gradient-to-r from-rose-950/80 via-purple-950/70 to-slate-900 border border-rose-500/50 hover:border-rose-400 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-lg group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-rose-400/80 bg-black shrink-0 shadow">
                  <img
                    src={
                      KNOWN_CREATOR_AVATARS[matchedCreator.name.toLowerCase()] ||
                      `https://unavatar.io/youtube/@${matchedCreator.handle.replace('@', '')}`
                    }
                    alt={matchedCreator.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://unavatar.io/youtube/@${matchedCreator.handle.replace('@', '')}`;
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-0.5">
                      <UserCheck size={9} />
                      YOUTUBE CREATOR
                    </span>
                    <span className="text-xs font-extrabold text-white truncate">{matchedCreator.name}</span>
                    <span className="text-[10px] text-rose-400 font-mono">{matchedCreator.handle}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5 truncate">
                    Browse all structured courses, playlists & full video catalog from {matchedCreator.name}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenCreator) {
                    onOpenCreator(matchedCreator.name);
                    setIsOpen(false);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 group-hover:from-rose-500 group-hover:to-pink-500 text-white text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow cursor-pointer"
              >
                <ListVideo size={13} />
                <span>View All Playlists & Videos</span>
              </button>
            </div>
          )}

          {/* Results List */}
          <div className="max-h-84 overflow-y-auto p-2 space-y-1.5 bg-[#0d0f1e]">
            {results.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <p className="text-xs font-semibold text-white mb-1">No exact local video match</p>
                <p className="text-[11px] text-gray-400 mb-3">Press Enter to search directly across all of YouTube with 0 ads.</p>
                <button
                  onClick={() => {
                    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                    window.open(searchUrl, '_blank', 'noopener,noreferrer');
                    setIsOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                >
                  <Globe size={13} />
                  <span>Search All of YouTube for &quot;{query}&quot;</span>
                </button>
              </div>
            ) : (
              results.map((res, index) => {
                const isSelected = index === selectedIndex;
                const isDirect = res.highlightField === 'direct' || res.record.videoId === directVideoId;

                return (
                  <div
                    key={res.record.id}
                    onClick={() => {
                      if (onPlayInModal) {
                        onPlayInModal(res.record);
                      } else {
                        handleInstantRedirect(res.directYouTubeUrl);
                      }
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                      isDirect
                        ? 'bg-gradient-to-r from-emerald-950/70 to-indigo-950/60 border-2 border-emerald-500/70 shadow-lg shadow-emerald-500/20'
                        : isSelected
                        ? 'bg-indigo-600/30 border border-indigo-500/50'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      {/* Video Thumbnail */}
                      <div className="relative w-18 h-11 rounded-lg overflow-hidden bg-black shrink-0 border border-white/15">
                        <img
                          src={res.record.thumbnailUrl}
                          alt={res.record.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.fallback && res.record.videoId) {
                              target.dataset.fallback = 'true';
                              target.src = `https://img.youtube.com/vi/${res.record.videoId}/0.jpg`;
                            }
                          }}
                        />
                        {res.record.duration && (
                          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-white">
                            {Math.floor(res.record.duration / 60)}:{String(res.record.duration % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      {/* Video Meta */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {isDirect ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 flex items-center gap-1 animate-pulse">
                              <Sparkles size={9} />
                              DIRECT URL MATCH
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 truncate">
                              {res.record.domain || res.record.category}
                            </span>
                          )}
                          <span className="text-[9px] text-gray-400 truncate">
                            {res.record.channel}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate leading-snug">
                          {res.record.title}
                        </h4>
                      </div>
                    </div>

                    {/* Action Button: 100% Ad-Free Modal Player */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onPlayInModal && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayInModal(res.record);
                            setIsOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer ${
                            isDirect
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                          title="Watch with zero ads in portal modal"
                        >
                          <Play size={11} fill="currentColor" />
                          <span>Watch Ad-Free</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 1-Click Creator Portal Quick Jump for any YouTube name */}
          {query.trim().length >= 2 && !directVideoId && (
            <div className="p-2.5 bg-slate-950 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-300 truncate">
                <ListVideo size={14} className="text-rose-400 shrink-0" />
                <span className="truncate">
                  View creator playlists, courses & all videos for &ldquo;<span className="text-white font-bold">{query}</span>&rdquo;
                </span>
              </div>
              <button
                onClick={() => {
                  if (onOpenCreator) {
                    onOpenCreator(query);
                    setIsOpen(false);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>View Creator Page</span>
                <ExternalLink size={11} />
              </button>
            </div>
          )}

          {/* Footer Guide */}
          <div className="px-3.5 py-2.5 bg-slate-900 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck size={12} />
                Ad-Free Real-Time Stream Enabled
              </span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-[9px] font-mono text-gray-200">Enter</kbd>
              <span>to play Ad-Free</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
