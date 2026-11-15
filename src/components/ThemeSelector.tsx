import { useState, useRef, useEffect } from 'react';
import { ThemeMode } from '../types';
import { THEMES } from '../themeConfig';
import { Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES[currentTheme] || THEMES.dark;

  const themeDots: Record<ThemeMode, string[]> = {
    dark: ['#6366f1', '#a855f7'],
    light: ['#0ea5e9', '#3b82f6'],
    cyberpunk: ['#06b6d4', '#d946ef'],
    emerald: ['#10b981', '#14b8a6'],
    sunset: ['#f59e0b', '#e11d48'],
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${open ? 'z-[9999]' : 'z-20'}`} ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-slate-900/90 dark:bg-slate-900/90 bg-white hover:border-indigo-400 transition-all text-xs text-gray-900 dark:text-white shadow-sm font-semibold cursor-pointer"
        title="Switch UI Theme"
      >
        <Palette size={14} className="text-indigo-500 dark:text-indigo-400" />
        <span>{activeTheme.icon}</span>
        <span className="hidden sm:inline">{activeTheme.name}</span>
        <div className="flex gap-1 ml-0.5">
          {themeDots[currentTheme]?.map((color, idx) => (
            <span
              key={idx}
              className="w-2 h-2 rounded-full border border-black/20 dark:border-white/30"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-indigo-500/40 bg-[#101224] text-white shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-2.5 z-[9999] opacity-100">
          <div className="text-[10px] font-bold text-indigo-300 px-2 py-1 uppercase tracking-wider flex items-center justify-between border-b border-white/10 pb-1.5">
            <span>Color Theme</span>
            <span>5 Palettes</span>
          </div>
          <div className="space-y-1.5 mt-1.5">
            {(Object.keys(THEMES) as ThemeMode[]).map((themeKey) => {
              const theme = THEMES[themeKey];
              const isSelected = currentTheme === themeKey;
              const dots = themeDots[themeKey] || ['#6366f1', '#a855f7'];

              return (
                <button
                  key={themeKey}
                  onClick={() => {
                    onSelectTheme(themeKey);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-white font-bold border border-indigo-400 shadow-sm'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{theme.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-white">{theme.name}</div>
                      <div className="flex gap-1 mt-0.5">
                        {dots.map((d, i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full border border-white/20"
                            style={{ backgroundColor: d }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
