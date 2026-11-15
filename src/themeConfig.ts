import { ThemeMode } from './types';

export interface ThemeDefinition {
  id: ThemeMode;
  name: string;
  icon: string;
  bgClass: string;
  headerBgClass: string;
  cardBgClass: string;
  borderClass: string;
  textClass: string;
  textMutedClass: string;
  primaryAccentClass: string;
  badgeClass: string;
  accentGradient: string;
}

export const THEMES: Record<ThemeMode, ThemeDefinition> = {
  dark: {
    id: 'dark',
    name: 'Midnight Obsidian',
    icon: '🌙',
    bgClass: 'bg-[#0a0a0f]',
    headerBgClass: 'bg-[#0a0a0f]/80 border-white/5',
    cardBgClass: 'bg-white/[0.02] hover:bg-white/[0.05]',
    borderClass: 'border-white/10',
    textClass: 'text-gray-100',
    textMutedClass: 'text-gray-400',
    primaryAccentClass: 'text-indigo-400',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    accentGradient: 'from-indigo-500 to-purple-600',
  },
  light: {
    id: 'light',
    name: 'Modern Clean',
    icon: '☀️',
    bgClass: 'bg-slate-50',
    headerBgClass: 'bg-white/80 border-slate-200',
    cardBgClass: 'bg-white hover:bg-slate-50 shadow-sm',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-900',
    textMutedClass: 'text-slate-500',
    primaryAccentClass: 'text-indigo-600',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentGradient: 'from-indigo-600 to-blue-600',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyber',
    icon: '⚡',
    bgClass: 'bg-[#050814]',
    headerBgClass: 'bg-[#050814]/90 border-cyan-500/20',
    cardBgClass: 'bg-cyan-950/10 hover:bg-cyan-900/20 border-cyan-500/20',
    borderClass: 'border-cyan-500/20',
    textClass: 'text-cyan-50',
    textMutedClass: 'text-cyan-400/70',
    primaryAccentClass: 'text-cyan-400',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    accentGradient: 'from-cyan-400 to-fuchsia-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Forest Tech',
    icon: '🌲',
    bgClass: 'bg-[#05140d]',
    headerBgClass: 'bg-[#05140d]/90 border-emerald-500/20',
    cardBgClass: 'bg-emerald-950/10 hover:bg-emerald-900/20 border-emerald-500/20',
    borderClass: 'border-emerald-500/20',
    textClass: 'text-emerald-50',
    textMutedClass: 'text-emerald-400/70',
    primaryAccentClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    accentGradient: 'from-emerald-400 to-teal-500',
  },
  sunset: {
    id: 'sunset',
    name: 'Warm Sunset',
    icon: '🌅',
    bgClass: 'bg-[#140a06]',
    headerBgClass: 'bg-[#140a06]/90 border-amber-500/20',
    cardBgClass: 'bg-amber-950/10 hover:bg-amber-900/20 border-amber-500/20',
    borderClass: 'border-amber-500/20',
    textClass: 'text-amber-50',
    textMutedClass: 'text-amber-400/70',
    primaryAccentClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    accentGradient: 'from-amber-400 to-rose-500',
  },
};

