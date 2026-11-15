import { useState } from 'react';
import { Compass, Sparkles, Clock, Filter, Layers, Play, ExternalLink, Zap } from 'lucide-react';
import { ContentRecord, BlockRule, DashboardStats, DateFilterState } from '../types';
import { shouldBlock } from '../store';
import { DOMAINS, SUBCATEGORIES } from '../taxonomy';
import { DateFilterBar } from './DateFilterBar';
import { isWithinDateFilter } from '../recommendationEngine';

interface SmartDiscoveryProps {
  records: ContentRecord[];
  rules: BlockRule[];
  stats: DashboardStats | null;
  onPlayInModal?: (record: ContentRecord) => void;
}

export function SmartDiscovery({ records, rules, stats, onPlayInModal }: SmartDiscoveryProps) {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    preset: 'all',
    recencyWeight: 0.5,
  });

  if (!stats) return <div className="text-center py-20 text-gray-500">Loading Smart Discovery...</div>;

  // Filter content based on user preferences and mood
  const discovered = records
    .filter((r) => !shouldBlock(r, rules))
    .filter((r) => isWithinDateFilter(r.timestamp, dateFilter))
    .filter((r) => {
      if (selectedDomain && r.domain !== selectedDomain) return false;
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (selectedDuration === 'short' && (r.duration || 0) > 300) return false;
      if (selectedDuration === 'medium' && ((r.duration || 0) <= 300 || (r.duration || 0) > 1200)) return false;
      if (selectedDuration === 'long' && (r.duration || 0) <= 1200) return false;

      // Mood keyword matching
      if (selectedMood === 'learn') {
        const titleLower = r.title.toLowerCase();
        return titleLower.includes('course') || titleLower.includes('tutorial') || titleLower.includes('learn') || titleLower.includes('guide') || titleLower.includes('deep dive') || (r.duration || 0) > 600;
      }
      if (selectedMood === 'entertain') {
        const titleLower = r.title.toLowerCase();
        return titleLower.includes('100s') || titleLower.includes('fast') || titleLower.includes('vs') || titleLower.includes('game') || (r.duration || 0) <= 600;
      }
      if (selectedMood === 'relax') {
        const titleLower = r.title.toLowerCase();
        return titleLower.includes('explained') || titleLower.includes('physics') || titleLower.includes('visualized') || titleLower.includes('space') || titleLower.includes('calm');
      }
      if (selectedMood === 'inspire') {
        const titleLower = r.title.toLowerCase();
        return titleLower.includes('ai') || titleLower.includes('future') || titleLower.includes('quantum') || titleLower.includes('gpt') || titleLower.includes('next');
      }

      return true;
    })
    .slice(0, 24);

  const moods = [
    {
      id: 'learn',
      emoji: '🧠',
      title: 'Learn & Master',
      tag: 'Deep Dives',
      description: 'Comprehensive tutorials, courses & software architecture',
      activeGradient: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-blue-500/40 border-blue-400 ring-2 ring-blue-400/50',
      inactiveClass: 'border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900/80 hover:border-blue-400/60 hover:bg-blue-950/60 text-gray-200',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      id: 'entertain',
      emoji: '🎬',
      title: 'Entertain & Enjoy',
      tag: 'Fast Paced',
      description: 'Quick takes, tech humor & high-energy breakdowns in 100s',
      activeGradient: 'bg-gradient-to-br from-fuchsia-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-fuchsia-500/40 border-fuchsia-400 ring-2 ring-fuchsia-400/50',
      inactiveClass: 'border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950/40 to-slate-900/80 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/60 text-gray-200',
      badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    },
    {
      id: 'relax',
      emoji: '🌊',
      title: 'Chill & Explore',
      tag: 'Calm Science',
      description: 'Fascinating science, visual math & tranquil cosmic journeys',
      activeGradient: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/40 border-emerald-400 ring-2 ring-emerald-400/50',
      inactiveClass: 'border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-900/80 hover:border-emerald-400/60 hover:bg-emerald-950/60 text-gray-200',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'inspire',
      emoji: '✨',
      title: 'Inspire & Innovate',
      tag: 'Future Tech',
      description: 'Frontier AI breakthroughs, quantum concepts & visionary roadmaps',
      activeGradient: 'bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white shadow-xl shadow-amber-500/40 border-amber-400 ring-2 ring-amber-400/50',
      inactiveClass: 'border-amber-500/20 bg-gradient-to-br from-amber-950/40 to-slate-900/80 hover:border-amber-400/60 hover:bg-amber-950/60 text-gray-200',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-teal-900/20 to-slate-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2.5 text-white">
            <Compass size={26} className="text-emerald-400 animate-spin-slow" />
            Smart Discovery Engine
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            Curate your feed instantly by current mood, taxonomy domain, and customized recency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
            <Zap size={13} className="text-emerald-400 fill-emerald-400" />
            Instant Real-time Filter
          </span>
        </div>
      </div>

      {/* Mood Selector (Vibrant Colorful Redesign addressing Image 4) */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-slate-900/70 to-teal-950/20 p-5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            What&apos;s your mood right now?
          </h3>
          <span className="text-xs text-emerald-300 font-semibold">
            {selectedMood ? `Filter Active: ${selectedMood}` : 'Click to filter vibe'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(selectedMood === mood.id ? '' : mood.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? `${mood.activeGradient} scale-[1.02]`
                    : `${mood.inactiveClass} hover:scale-[1.01]`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform">{mood.emoji}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isSelected ? 'bg-white/20 text-white border-white/40' : mood.badgeColor
                  }`}>
                    {mood.tag}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">{mood.title}</div>
                <div className={`text-xs mt-1 leading-snug ${isSelected ? 'text-white/90 font-medium' : 'text-gray-400'}`}>
                  {mood.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customized Date & Recency Filter (Addressing Image 3) */}
      <DateFilterBar filter={dateFilter} onChange={setDateFilter} accentColor="emerald" />

      {/* Domain, Category & Duration Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-emerald-300 mb-1.5 block flex items-center gap-1 font-semibold">
            <Layers size={13} className="text-emerald-400" />
            Domain (Level 1)
          </label>
          <select
            value={selectedDomain}
            onChange={(e) => {
              setSelectedDomain(e.target.value);
              setSelectedCategory('');
            }}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-xs text-gray-200 outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="" className="bg-[#12121a]">All 8 Domains</option>
            {DOMAINS.map((dom) => (
              <option key={dom.id} value={dom.name} className="bg-[#12121a]">
                {dom.icon} {dom.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-emerald-300 mb-1.5 block flex items-center gap-1 font-semibold">
            <Filter size={13} className="text-emerald-400" />
            Category (Level 2)
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-xs text-gray-200 outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="" className="bg-[#12121a]">All 57 Categories</option>
            {SUBCATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name} className="bg-[#12121a]">
                #{cat.id} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-emerald-300 mb-1.5 block flex items-center gap-1 font-semibold">
            <Clock size={13} className="text-emerald-400" />
            Duration
          </label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-xs text-gray-200 outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="" className="bg-[#12121a]">Any Duration</option>
            <option value="short" className="bg-[#12121a]">⚡ Quick (&lt; 5 min)</option>
            <option value="medium" className="bg-[#12121a]">⏱️ Medium (5-20 min)</option>
            <option value="long" className="bg-[#12121a]">📚 Deep Dive (&gt; 20 min)</option>
          </select>
        </div>
      </div>

      {/* Discovered Content (Vibrant Colorful Grid addressing Image 1) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            {discovered.length} Curated Videos Match Your Preferences
          </h3>
          <span className="text-xs text-gray-400">
            High-definition real YouTube video stream
          </span>
        </div>

        {discovered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-base text-gray-300 font-semibold mb-1">No videos found for this combination</p>
            <p className="text-xs text-gray-500">Try relaxing your mood filter or broadening the date range.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discovered.map((record) => {
              const youtubeUrl =
                record.url ||
                `https://www.youtube.com/watch?v=${record.videoId}`;

              const thumbUrl =
                record.thumbnailUrl ||
                `https://i.ytimg.com/vi/${record.videoId}/hqdefault.jpg`;

              return (
                <div
                  key={record.id}
                  className="group rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-200 p-4 flex flex-col justify-between backdrop-blur-xl"
                >
                  <div>
                    {/* Domain & Category Badges */}
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 truncate">
                        {record.domain || 'Software Dev'}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/10 text-gray-300 shrink-0">
                        #{record.subcategoryId || 1} {record.category}
                      </span>
                    </div>

                    {/* Thumbnail (Plays 100% on Website) */}
                    <div
                      onClick={() => onPlayInModal && onPlayInModal(record)}
                      className="block relative w-full h-36 rounded-xl bg-black/60 overflow-hidden mb-3 group/thumb shadow-md cursor-pointer"
                      title="Play video on website ad-free"
                    >
                      <img
                        src={thumbUrl}
                        alt={record.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback && record.videoId) {
                            target.dataset.fallback = 'true';
                            target.src = `https://img.youtube.com/vi/${record.videoId}/0.jpg`;
                          } else {
                            target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80';
                          }
                        }}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/0 transition-colors" />

                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl transform scale-90 group-hover/thumb:scale-100 transition-transform font-bold">
                          <Play size={20} fill="black" className="ml-0.5" />
                        </div>
                      </div>

                      {/* Duration Tag */}
                      {record.duration && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono font-bold text-white shadow">
                          {Math.floor(record.duration / 60)}:{String(record.duration % 60).padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Title & Channel */}
                    <div
                      onClick={() => onPlayInModal && onPlayInModal(record)}
                      className="block group/title cursor-pointer"
                      title="Play video on website"
                    >
                      <h4 className="text-sm font-bold line-clamp-2 text-white group-hover/title:text-emerald-300 transition-colors mb-1 leading-snug">
                        {record.title}
                      </h4>
                      <p className="text-xs text-emerald-200/80 mb-2 truncate font-medium">
                        {record.channel}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPlayInModal && onPlayInModal(record)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
                        title="Play on website without ads"
                      >
                        <Play size={11} fill="currentColor" />
                        <span>Play on Website</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
