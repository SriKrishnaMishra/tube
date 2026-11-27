import { ThemeMode } from '../types';
import { THEMES } from '../themeConfig';
import { AlertTriangle, Download, Github, BookOpen, Trash2, Palette, Check } from 'lucide-react';
import { downloadExtensionZip } from '../utils/extensionZip';

interface SettingsProps {
  onClear: () => void;
  theme: ThemeMode;
  onToggleTheme: (theme?: ThemeMode) => void;
}

export function Settings({ onClear, theme, onToggleTheme }: SettingsProps) {
  const handleClear = () => {
    if (confirm('Clear all local data? This cannot be undone.')) {
      onClear();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure your extension preferences</p>
      </div>

      {/* Appearance & Themes (Vibrant Redesign) */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-purple-950/20 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette size={18} className="text-indigo-400" />
            Themable UI System
          </h3>
          <span className="text-xs text-indigo-300 font-semibold">5 Curated Developer Palettes</span>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          Select a vivid design theme. Colors, glowing borders, cards, and charts adapt dynamically across the entire application.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(Object.keys(THEMES) as ThemeMode[]).map((themeKey) => {
            const def = THEMES[themeKey];
            const isSelected = theme === themeKey;

            const themeGradients: Record<ThemeMode, { banner: string; dots: string[]; glow: string }> = {
              dark: {
                banner: 'from-indigo-600 via-purple-600 to-slate-900',
                dots: ['#6366f1', '#a855f7', '#0f172a'],
                glow: 'border-indigo-500/80 shadow-lg shadow-indigo-500/30',
              },
              light: {
                banner: 'from-sky-400 via-blue-500 to-indigo-600',
                dots: ['#0ea5e9', '#3b82f6', '#f8fafc'],
                glow: 'border-blue-400/80 shadow-lg shadow-blue-400/30',
              },
              cyberpunk: {
                banner: 'from-cyan-400 via-fuchsia-500 to-indigo-950',
                dots: ['#06b6d4', '#d946ef', '#050814'],
                glow: 'border-cyan-400/80 shadow-lg shadow-cyan-400/30',
              },
              emerald: {
                banner: 'from-emerald-400 via-teal-500 to-slate-950',
                dots: ['#10b981', '#14b8a6', '#05140d'],
                glow: 'border-emerald-400/80 shadow-lg shadow-emerald-400/30',
              },
              sunset: {
                banner: 'from-amber-400 via-orange-500 to-rose-600',
                dots: ['#f59e0b', '#f97316', '#e11d48'],
                glow: 'border-amber-400/80 shadow-lg shadow-amber-400/30',
              },
            };

            const tStyle = themeGradients[themeKey];

            return (
              <button
                key={themeKey}
                onClick={() => onToggleTheme(themeKey)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? `bg-slate-900/90 ${tStyle.glow} ring-2 ring-white/20 scale-[1.02]`
                    : 'bg-slate-900/50 border-white/10 hover:border-white/25 hover:bg-slate-900/80 hover:scale-[1.01]'
                }`}
              >
                {/* Visual Palette Gradient Swatch */}
                <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${tStyle.banner} p-2 flex items-center justify-between shadow-inner mb-3`}>
                  <span className="text-xl drop-shadow">{def.icon}</span>
                  <div className="flex gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-sm">
                    {tStyle.dots.map((dot, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: dot }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-bold text-white">{def.name}</div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs shadow">
                      ✓
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 capitalize font-medium">{themeKey} mode palette</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop App Installation on Laptop */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-indigo-300">
          <Download size={16} className="text-indigo-400" />
          Install DevTube on Your Laptop
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Convert this web project into a standalone desktop application with its own icon on your taskbar and desktop.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <h4 className="text-xs font-bold text-white mb-1">Option A: Native Browser App (PWA)</h4>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              Click the install icon in your address bar (or click &quot;Install Laptop App&quot; in the header). Runs without browser address bars as a real Windows application.
            </p>
            <div className="text-[10px] text-emerald-400 font-mono">
              Status: Ready to install in Chrome/Edge
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <h4 className="text-xs font-bold text-white mb-1">Option B: 1-Click Desktop Launcher</h4>
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              We included <code className="px-1 py-0.5 rounded bg-white/10 text-indigo-300">Launch_App.bat</code> in the project directory. Double-click it on your laptop anytime to launch both backend and frontend automatically.
            </p>
            <div className="text-[10px] text-indigo-300 font-mono">
              Shortcut generator: create_desktop_shortcut.bat
            </div>
          </div>
        </div>
      </div>

      {/* Installation Guide */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Download size={16} className="text-indigo-400" />
          Chrome Extension Installation
        </h3>

        {/* Download button */}
        <div className="mb-4 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
          <p className="text-xs text-indigo-300 mb-3 font-medium">📦 Download Extension as ZIP:</p>
          <button
            onClick={downloadExtensionZip}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Download recommendation-tracker.zip
          </button>
          <p className="text-[11px] text-gray-500 mt-2">
            Extract the ZIP → then in Chrome, click "Load unpacked" → select the extracted folder
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <p>Download all 6 files above and place them in a single folder</p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <p>Open Chrome and navigate to <code className="px-1.5 py-0.5 rounded bg-white/5 text-xs">chrome://extensions/</code></p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <p>Enable <strong>Developer mode</strong> in the top right corner</p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">4</span>
            <p>Click <strong>Load unpacked</strong> and select the folder containing the files</p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">5</span>
            <p>Pin the extension and visit YouTube to start tracking!</p>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-emerald-400" />
          Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="font-medium text-xs text-indigo-400 mb-1">Frontend</p>
            <p className="text-xs text-gray-500">React + TypeScript + Tailwind CSS</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="font-medium text-xs text-indigo-400 mb-1">Extension</p>
            <p className="text-xs text-gray-500">Manifest V3 + Service Worker</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="font-medium text-xs text-indigo-400 mb-1">Storage</p>
            <p className="text-xs text-gray-500">IndexedDB + Chrome Storage API</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <p className="font-medium text-xs text-indigo-400 mb-1">Future Backend</p>
            <p className="text-xs text-gray-500">Python + FastAPI + PostgreSQL</p>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <h3 className="text-sm font-semibold mb-2 text-emerald-400">🔒 Privacy First</h3>
        <ul className="space-y-1.5 text-xs text-gray-400">
          <li>• All data stored locally in your browser</li>
          <li>• No passwords, cookies, or sensitive data collected</li>
          <li>• Minimum browser permissions requested</li>
          <li>• No data sent to external servers without consent</li>
          <li>• Open source and auditable code</li>
        </ul>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-red-400">
          <AlertTriangle size={16} />
          Danger Zone
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Clear all tracked activity and blocking rules from this browser. This action cannot be undone.
        </p>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-sm font-medium transition-colors"
        >
          <Trash2 size={14} />
          Clear all local data
        </button>
      </div>

      {/* Links */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <a href="#" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          <Github size={14} />
          GitHub
        </a>
        <a href="#" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
          <BookOpen size={14} />
          Documentation
        </a>
      </div>
    </div>
  );
}
