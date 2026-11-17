import { useState, useEffect, useMemo } from 'react';
import {
  X,
  ExternalLink,
  ThumbsUp,
  Eye,
  Clock,
  ShieldCheck,
  Zap,
  RefreshCw,
  Maximize2,
  Minimize2,
  Tv,
  Share2,
  Check,
  ListVideo,
  Play,
  SkipForward,
  Sparkles,
  Search,
} from 'lucide-react';
import { ContentRecord } from '../types';
import { extractYouTubeVideoId } from '../universalYouTubeSearch';

interface VideoPlayerModalProps {
  record: ContentRecord | null;
  onClose: () => void;
  allRecords?: ContentRecord[];
  onSelectVideo?: (record: ContentRecord) => void;
}

export function VideoPlayerModal({
  record,
  onClose,
  allRecords = [],
  onSelectVideo,
}: VideoPlayerModalProps) {
  const [activeRecord, setActiveRecord] = useState<ContentRecord | null>(record);
  const [playerMode, setPlayerMode] = useState<'standard-yt' | 'clean-yt' | 'adfree'>('standard-yt');
  const [mirrorIndex, setMirrorIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'modal' | 'theater' | 'mini'>('modal');
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handlePlayCustomInput = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const extractedId = extractYouTubeVideoId(trimmed) || (trimmed.length === 11 && !trimmed.includes(' ') ? trimmed : null);
    if (!extractedId) {
      setInputError('Please enter a valid YouTube video URL or 11-character video ID.');
      return;
    }
    setInputError(null);
    const newRecord: ContentRecord = {
      id: `custom-${extractedId}-${Date.now()}`,
      videoId: extractedId,
      url: `https://www.youtube.com/watch?v=${extractedId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${extractedId}/hqdefault.jpg`,
      title: `Custom YouTube Stream (${extractedId})`,
      channel: 'YouTube Video',
      domain: 'Universal YouTube',
      category: 'Direct URL Stream',
      subcategoryId: 1,
      duration: 600,
      timestamp: Date.now(),
      source: 'search',
      tags: ['custom-stream'],
    };
    setActiveRecord(newRecord);
    setCustomInput('');
    if (onSelectVideo) onSelectVideo(newRecord);
  };

  // Sync prop changes to activeRecord
  useEffect(() => {
    setActiveRecord(record);
  }, [record]);

  // Compute related videos from the same creator and category
  const relatedVideos = useMemo(() => {
    if (!activeRecord || !allRecords || allRecords.length === 0) return [];
    const curId = activeRecord.videoId;
    const curChannel = (activeRecord.channel || '').toLowerCase();
    const curCategory = (activeRecord.category || '').toLowerCase();

    // 1. Same channel videos first
    const sameChannel = allRecords.filter(
      (r) => r.videoId !== curId && (r.channel || '').toLowerCase() === curChannel
    );
    // 2. Same category videos next
    const sameCategory = allRecords.filter(
      (r) =>
        r.videoId !== curId &&
        (r.channel || '').toLowerCase() !== curChannel &&
        (r.category || '').toLowerCase() === curCategory
    );
    // 3. Other catalog videos
    const others = allRecords.filter(
      (r) =>
        r.videoId !== curId &&
        (r.channel || '').toLowerCase() !== curChannel &&
        (r.category || '').toLowerCase() !== curCategory
    );

    return [...sameChannel, ...sameCategory, ...others].slice(0, 16);
  }, [activeRecord, allRecords]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        if (viewMode === 'theater') setViewMode('modal');
        else onClose();
      } else if (e.key.toLowerCase() === 't') {
        setViewMode((prev) => (prev === 'theater' ? 'modal' : 'theater'));
      } else if (e.key.toLowerCase() === 'm') {
        setViewMode((prev) => (prev === 'mini' ? 'modal' : 'mini'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, viewMode]);

  if (!activeRecord) return null;

  const handlePlayRelated = (newRec: ContentRecord) => {
    setActiveRecord(newRec);
    if (onSelectVideo) {
      onSelectVideo(newRec);
    }
  };

  const handleNextVideo = () => {
    if (relatedVideos.length > 0) {
      handlePlayRelated(relatedVideos[0]);
    }
  };

  const PROXY_MIRRORS = [
    `https://piped.video/embed/${activeRecord.videoId}`,
    `https://inv.tux.pizza/embed/${activeRecord.videoId}?autoplay=1`,
    `https://invidious.privacyredirect.com/embed/${activeRecord.videoId}?autoplay=1&quality=dash`,
  ];

  const youtubeUrl = activeRecord.url || `https://www.youtube.com/watch?v=${activeRecord.videoId}`;
  const originParam = typeof window !== 'undefined' && window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : '';

  // Standard YouTube Player (Ensures maximum playback compatibility across all creators & networks)
  const standardYtUrl = `https://www.youtube.com/embed/${activeRecord.videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&controls=1&enablejsapi=1${originParam}`;

  // Reliable YouTube No-Cookie Player (Alternative privacy-focused stream)
  const noCookieUrl = `https://www.youtube-nocookie.com/embed/${activeRecord.videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&controls=1&enablejsapi=1${originParam}`;

  // Alternative open source proxy stream
  const proxyUrl = PROXY_MIRRORS[mirrorIndex % PROXY_MIRRORS.length];

  const currentEmbedUrl =
    playerMode === 'standard-yt'
      ? standardYtUrl
      : playerMode === 'clean-yt'
      ? noCookieUrl
      : proxyUrl;

  const rotateMirror = () => {
    setMirrorIndex((prev) => (prev + 1) % PROXY_MIRRORS.length);
  };

  // Mini-Player Dock (Bottom-Right corner so user can browse portal while watching)
  if (viewMode === 'mini') {
    return (
      <div className="fixed bottom-5 right-5 z-[99999] w-80 sm:w-96 rounded-2xl border border-emerald-500/50 bg-[#0c0d18] shadow-2xl shadow-emerald-500/20 overflow-hidden text-gray-100 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
        {/* Mini Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-white/10 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-white truncate">{activeRecord.title}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {relatedVideos.length > 0 && (
              <button
                onClick={handleNextVideo}
                className="p-1 rounded-md hover:bg-white/10 text-emerald-400 hover:text-white transition-colors"
                title="Next Related Video"
              >
                <SkipForward size={13} />
              </button>
            )}
            <button
              onClick={() => setViewMode('modal')}
              className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Expand to Standard Modal (M)"
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={() => setViewMode('theater')}
              className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Expand to Theater View (T)"
            >
              <Tv size={13} />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Close Video"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            key={currentEmbedUrl}
            src={currentEmbedUrl}
            title={activeRecord.title}
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Mini Footer */}
        <div className="px-3 py-1.5 bg-slate-900/90 text-[10px] flex items-center justify-between text-gray-400">
          <span className="truncate">{activeRecord.channel}</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck size={10} />
            Ad-Free On Website
          </span>
        </div>
      </div>
    );
  }

  // Standard Modal & Theater View
  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto ${
        viewMode === 'theater' ? 'bg-black/95' : 'bg-black/85'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full my-auto rounded-3xl border border-emerald-500/30 bg-[#0c0d18] shadow-2xl shadow-emerald-500/10 overflow-hidden text-gray-100 flex flex-col transition-all duration-300 max-h-[95vh] ${
          viewMode === 'theater' ? 'max-w-6xl w-[95vw]' : 'max-w-4xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-slate-900/90 gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" />
              Ad-Free On Website
            </span>
            {activeRecord.playlistTitle && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 truncate max-w-xs shrink-0">
                <ListVideo size={10} />
                {activeRecord.playlistTitle}
              </span>
            )}
            <h3 className="text-xs sm:text-sm font-bold text-white truncate">{activeRecord.title}</h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Next Video Quick Button */}
            {relatedVideos.length > 0 && (
              <button
                onClick={handleNextVideo}
                className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                title="Play next related video on website"
              >
                <SkipForward size={12} />
                <span className="hidden sm:inline">Next</span>
              </button>
            )}

            {/* Stream Mode Selector */}
            <div className="flex items-center rounded-xl bg-black/50 border border-white/10 p-0.5 text-[11px]">
              <button
                onClick={() => setPlayerMode('standard-yt')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  playerMode === 'standard-yt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Universal YouTube Stream (Fixes 'Video Unavailable')"
              >
                <Play size={11} />
                <span>Standard HD</span>
              </button>
              <button
                onClick={() => setPlayerMode('clean-yt')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  playerMode === 'clean-yt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Privacy-Enhanced No-Cookie Stream"
              >
                <ShieldCheck size={11} className="text-emerald-300" />
                <span>No-Cookie</span>
              </button>
              <button
                onClick={() => setPlayerMode('adfree')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  playerMode === 'adfree'
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Alternative Proxy Stream (Piped / Invidious)"
              >
                <Zap size={11} />
                <span>Proxy</span>
              </button>
            </div>

            {playerMode === 'adfree' && (
              <button
                onClick={rotateMirror}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-emerald-300 transition-colors border border-white/10 text-[11px] cursor-pointer"
                title="Rotate to Next Mirror"
              >
                <RefreshCw size={13} />
              </button>
            )}

            {/* View Mode Toggles */}
            <button
              onClick={() => setViewMode(viewMode === 'theater' ? 'modal' : 'theater')}
              className={`p-1.5 rounded-lg transition-colors border text-[11px] flex items-center gap-1 ${
                viewMode === 'theater'
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
              title="Toggle Theater Mode (T)"
            >
              <Tv size={13} />
              <span className="hidden md:inline">Theater</span>
            </button>

            <button
              onClick={() => setViewMode('mini')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors text-[11px] flex items-center gap-1"
              title="Minimize to Corner Mini-Player (M) to browse while watching"
            >
              <Minimize2 size={13} />
              <span className="hidden md:inline">Mini</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(youtubeUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-[11px] font-bold transition-colors border border-white/10 flex items-center gap-1 cursor-pointer"
              title="Copy video link"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              title="Close Player (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Container (Video + Details + Related Masterclasses Shelf) */}
        <div className="overflow-y-auto max-h-[calc(95vh-60px)]">
          {/* Video Player Frame with sandbox to prevent parent window redirect */}
          <div className={`relative w-full aspect-video bg-black ${viewMode === 'theater' ? 'max-h-[70vh]' : ''}`}>
            <iframe
              key={currentEmbedUrl}
              src={currentEmbedUrl}
              title={activeRecord.title}
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Stream Switch & Troubleshooting Bar */}
          <div className="px-4 py-2.5 bg-black/70 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-gray-300 flex items-center gap-1.5 font-medium">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Streaming on website. If video says &quot;Unavailable&quot;, switch stream:</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlayerMode('standard-yt')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  playerMode === 'standard-yt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                }`}
                title="Universal YouTube Stream (Fixes 'Video unavailable' instantly)"
              >
                <span>▶ Standard Stream</span>
              </button>
              <button
                onClick={() => setPlayerMode('clean-yt')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  playerMode === 'clean-yt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                }`}
                title="Privacy-Enhanced No-Cookie Stream"
              >
                <span>🛡️ Ad-Free HD</span>
              </button>
              <button
                onClick={() => {
                  if (playerMode === 'adfree') {
                    rotateMirror();
                  } else {
                    setPlayerMode('adfree');
                  }
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  playerMode === 'adfree'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                }`}
                title="Alternative Open-Source Mirror (Click to cycle mirrors)"
              >
                <span>⚡ Proxy Stream {playerMode === 'adfree' ? `(#${(mirrorIndex % PROXY_MIRRORS.length) + 1})` : ''}</span>
              </button>
            </div>
          </div>

          {/* Universal YouTube Player Input Bar (Play ANY video on YouTube right here) */}
          <div className="px-4 py-2 bg-[#0c0d18] border-t border-white/10 flex items-center gap-2">
            <Search size={14} className="text-emerald-400 shrink-0" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePlayCustomInput();
              }}
              placeholder="Paste ANY YouTube URL or 11-char Video ID to stream directly on this website..."
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
            />
            {inputError && (
              <span className="text-[10px] text-rose-400 shrink-0">{inputError}</span>
            )}
            <button
              onClick={handlePlayCustomInput}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow"
            >
              Stream Now
            </button>
          </div>

          {/* Video Details & Ad-Free Shield Status Footer */}
          <div className="p-3.5 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="text-emerald-300 font-extrabold">{activeRecord.channel}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    #{activeRecord.subcategoryId || 1} {activeRecord.category}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={12} />
                  <span>Zero commercial interruption • Direct on website stream</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300 flex-wrap">
              {activeRecord.viewCount && (
                <span className="flex items-center gap-1">
                  <Eye size={12} className="text-cyan-400" />
                  {activeRecord.viewCount.toLocaleString()} views
                </span>
              )}
              {activeRecord.likes && (
                <span className="flex items-center gap-1">
                  <ThumbsUp size={12} className="text-rose-400" />
                  {activeRecord.likes.toLocaleString()} likes
                </span>
              )}
              {activeRecord.duration && (
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-amber-400" />
                  {Math.floor(activeRecord.duration / 60)}:{String(activeRecord.duration % 60).padStart(2, '0')}
                </span>
              )}
            </div>
          </div>

          {/* Related Videos & Next Up Shelf (Plays 100% on Website without YouTube Redirect) */}
          {relatedVideos.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#0a0b12] border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Related Masterclasses from {activeRecord.channel} & Related Topics</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Plays on Website (No YouTube Redirect)
                    </span>
                  </h4>
                </div>

                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  Click any video to stream instantly
                </span>
              </div>

              {/* Horizontal Scrollable Carousel of Related Videos */}
              <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {relatedVideos.map((rel) => (
                  <div
                    key={rel.id || rel.videoId}
                    onClick={() => handlePlayRelated(rel)}
                    className="w-56 shrink-0 p-2.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="relative w-full h-28 rounded-lg bg-black overflow-hidden mb-2">
                        <img
                          src={rel.thumbnailUrl || `https://i.ytimg.com/vi/${rel.videoId}/hqdefault.jpg`}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-9 h-9 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                            <Play size={14} fill="black" className="ml-0.5" />
                          </div>
                        </div>
                        {rel.duration && (
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                            {Math.floor(rel.duration / 60)}:{String(rel.duration % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-emerald-300 transition-colors">
                        {rel.title}
                      </h5>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                      <span className="truncate max-w-[120px]">{rel.channel}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <Play size={8} fill="currentColor" /> Play Here
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
