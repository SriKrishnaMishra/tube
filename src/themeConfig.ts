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
    name: 'Studio Obsidian',
    icon: '🌙',
    bgClass: 'bg-[#09090b]',
    headerBgClass: 'bg-[#09090b]/85 border-white/[0.08]',
    cardBgClass: 'bg-[#111116] hover:bg-[#16161d]',
    borderClass: 'border-white/[0.08]',
    textClass: 'text-zinc-100',
    textMutedClass: 'text-zinc-400',
    primaryAccentClass: 'text-indigo-400',
    badgeClass: 'bg-indigo-500/12 text-indigo-300 border-indigo-500/25',
    accentGradient: 'from-indigo-500 to-indigo-600',
  },
  light: {
    id: 'light',
    name: 'Studio Paper',
    icon: '☀️',
    bgClass: 'bg-slate-50',
    headerBgClass: 'bg-white/90 border-slate-200/80',
    cardBgClass: 'bg-white hover:bg-slate-50/90 shadow-sm',
    borderClass: 'border-slate-200',
    textClass: 'text-slate-900',
    textMutedClass: 'text-slate-500',
    primaryAccentClass: 'text-indigo-600',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentGradient: 'from-indigo-600 to-indigo-700',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyber',
    icon: '⚡',
    bgClass: 'bg-[#050814]',
    headerBgClass: 'bg-[#050814]/90 border-cyan-500/20',
    cardBgClass: 'bg-[#090f24] hover:bg-[#0d1633] border-cyan-500/20',
    borderClass: 'border-cyan-500/20',
    textClass: 'text-cyan-50',
    textMutedClass: 'text-cyan-300/70',
    primaryAccentClass: 'text-cyan-400',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    accentGradient: 'from-cyan-500 to-indigo-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Forest Terminal',
    icon: '🌲',
    bgClass: 'bg-[#06120c]',
    headerBgClass: 'bg-[#06120c]/90 border-emerald-500/20',
    cardBgClass: 'bg-[#0a1c13] hover:bg-[#0e261a] border-emerald-500/20',
    borderClass: 'border-emerald-500/20',
    textClass: 'text-emerald-50',
    textMutedClass: 'text-emerald-300/70',
    primaryAccentClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    accentGradient: 'from-emerald-500 to-teal-600',
  },
  sunset: {
    id: 'sunset',
    name: 'Warm Amber',
    icon: '🌅',
    bgClass: 'bg-[#120b07]',
    headerBgClass: 'bg-[#120b07]/90 border-amber-500/20',
    cardBgClass: 'bg-[#1c120c] hover:bg-[#241710] border-amber-500/20',
    borderClass: 'border-amber-500/20',
    textClass: 'text-amber-50',
    textMutedClass: 'text-amber-300/70',
    primaryAccentClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    accentGradient: 'from-amber-500 to-orange-600',
  },
};
