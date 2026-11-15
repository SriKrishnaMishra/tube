import { useState } from 'react';
import { Calendar, Clock, Sliders, Sparkles, Globe, Zap, Moon, Trophy, Settings } from 'lucide-react';
import { DateFilterState, DatePreset } from '../types';

interface DateFilterBarProps {
  filter: DateFilterState;
  onChange: (filter: DateFilterState) => void;
  accentColor?: string;
}

export function DateFilterBar({ filter, onChange }: DateFilterBarProps) {
  const [showCustom, setShowCustom] = useState(filter.preset === 'custom');
  const [showRecencyTuner, setShowRecencyTuner] = useState(false);

  const presets: {
    id: DatePreset;
    label: string;
    sub: string;
    icon: React.ReactNode;
    activeGradient: string;
    inactiveBorder: string;
    accentColor: string;
  }[] = [
    {
      id: 'all',
      label: 'All Time',
      sub: 'Full catalog',
      icon: <Globe size={15} className="text-indigo-400" />,
      activeGradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 border-indigo-400',
      inactiveBorder: 'hover:border-indigo-500/50 hover:bg-indigo-500/10',
      accentColor: 'text-indigo-400',
    },
    {
      id: 'today',
      label: 'Today',
      sub: '< 24 hours',
      icon: <Zap size={15} className="text-emerald-400" />,
      activeGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40 border-emerald-400',
      inactiveBorder: 'hover:border-emerald-500/50 hover:bg-emerald-500/10',
      accentColor: 'text-emerald-400',
    },
    {
      id: 'week',
      label: 'Past 7 Days',
      sub: 'Weekly fresh',
      icon: <Calendar size={15} className="text-cyan-400" />,
      activeGradient: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40 border-cyan-400',
      inactiveBorder: 'hover:border-cyan-500/50 hover:bg-cyan-500/10',
      accentColor: 'text-cyan-400',
    },
    {
      id: 'month',
      label: 'Past 30 Days',
      sub: 'Monthly',
      icon: <Moon size={15} className="text-purple-400" />,
      activeGradient: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/40 border-purple-400',
      inactiveBorder: 'hover:border-purple-500/50 hover:bg-purple-500/10',
      accentColor: 'text-purple-400',
    },
    {
      id: 'quarter',
      label: 'This Quarter',
      sub: '90 days',
      icon: <Trophy size={15} className="text-amber-400" />,
      activeGradient: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/40 border-amber-400',
      inactiveBorder: 'hover:border-amber-500/50 hover:bg-amber-500/10',
      accentColor: 'text-amber-400',
    },
    {
      id: 'custom',
      label: 'Custom Date',
      sub: 'Pick range',
      icon: <Settings size={15} className="text-rose-400" />,
      activeGradient: 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/40 border-rose-400',
      inactiveBorder: 'hover:border-rose-500/50 hover:bg-rose-500/10',
      accentColor: 'text-rose-400',
    },
  ];

  const handlePresetSelect = (preset: DatePreset) => {
    if (preset === 'custom') {
      setShowCustom(true);
      const now = new Date();
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      onChange({
        ...filter,
        preset: 'custom',
        startDate: filter.startDate || twoWeeksAgo.toISOString().split('T')[0],
        endDate: filter.endDate || now.toISOString().split('T')[0],
      });
    } else {
      setShowCustom(false);
      onChange({
        ...filter,
        preset,
      });
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-purple-950/20 p-5 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <Calendar size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              Customized Date & Recency Filter
              <Sparkles size={13} className="text-amber-400" />
            </span>
            <p className="text-[11px] text-indigo-300/80">
              Filter recommendations by temporal freshness and customize decay weight
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRecencyTuner(!showRecencyTuner)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showRecencyTuner
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-md shadow-indigo-500/30'
              : 'border-white/10 bg-white/5 text-gray-300 hover:border-indigo-400/50 hover:bg-white/10'
          }`}
        >
          <Sliders size={13} />
          <span>Recency Weight: {Math.round(filter.recencyWeight * 100)}%</span>
        </button>
      </div>

      {/* Preset pills with rich colorful gradients */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {presets.map((p) => {
          const isActive = filter.preset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p.id)}
              className={`p-3 rounded-xl text-left transition-all border ${
                isActive
                  ? `${p.activeGradient} scale-[1.02] ring-2 ring-white/20`
                  : `bg-slate-900/60 border-white/10 text-gray-300 ${p.inactiveBorder} hover:scale-[1.01]`
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{p.label}</span>
                {p.icon}
              </div>
              <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-gray-400'} truncate font-medium`}>
                {p.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Date Range Inputs */}
      {showCustom && (
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/30">
            <label className="block text-xs font-semibold text-rose-300 mb-1.5 flex items-center gap-1.5">
              <Clock size={13} className="text-rose-400" />
              Start Date (From)
            </label>
            <input
              type="date"
              value={filter.startDate || ''}
              onChange={(e) =>
                onChange({
                  ...filter,
                  preset: 'custom',
                  startDate: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50"
            />
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/30">
            <label className="block text-xs font-semibold text-rose-300 mb-1.5 flex items-center gap-1.5">
              <Clock size={13} className="text-rose-400" />
              End Date (To)
            </label>
            <input
              type="date"
              value={filter.endDate || ''}
              onChange={(e) =>
                onChange({
                  ...filter,
                  preset: 'custom',
                  endDate: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50"
            />
          </div>
        </div>
      )}

      {/* Recency Tuning Slider */}
      {showRecencyTuner && (
        <div className="pt-3 border-t border-white/10 p-3 rounded-xl bg-slate-900/70 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center gap-4 animate-in fade-in">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-medium text-gray-300 mb-2">
              <span className="text-emerald-400">🌲 All-Time Classics</span>
              <span className="text-indigo-400 font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                {Math.round(filter.recencyWeight * 100)}% Freshness Weight
              </span>
              <span className="text-amber-400">⚡ Latest Uploads</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={filter.recencyWeight}
              onChange={(e) =>
                onChange({
                  ...filter,
                  recencyWeight: parseFloat(e.target.value),
                })
              }
              className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          <div className="text-[11px] text-indigo-300 max-w-xs leading-relaxed font-medium">
            ✨ Higher weight elevates recent uploads (last 72 hours) to top ranking slots.
          </div>
        </div>
      )}
    </div>
  );
}
