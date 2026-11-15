import { TabId, ThemeMode } from '../types';
import { InstallAppButton } from './InstallAppButton';
import {
  Globe,
  LayoutDashboard,
  Eye,
  ShieldOff,
  BarChart3,
  Settings,
  Zap,
  Compass,
  Sparkles,
  Search,
  Tv,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  theme: ThemeMode;
}

const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'channels', label: 'Channels & Playlists', icon: <Tv size={18} className="text-rose-400" /> },
  { id: 'browser', label: 'Content Browser', icon: <Search size={18} /> },
  { id: 'recommendations', label: 'AI Recommendations', icon: <Sparkles size={18} /> },
  { id: 'discovery', label: 'Smart Discovery', icon: <Compass size={18} /> },
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'tracking', label: 'Tracking', icon: <Eye size={18} /> },
  { id: 'blocking', label: 'Blocking', icon: <ShieldOff size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export function Sidebar({ activeTab, onTabChange, theme }: SidebarProps) {
  const isDark = theme !== 'light';

  return (
    <aside className={`w-64 h-full flex flex-col border-r ${isDark ? 'bg-[#0d0d14] border-white/5' : 'bg-white border-gray-200'}`}>
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="font-semibold text-sm">RecTracker</span>
            <span className={`block text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>v0.1.0 MVP</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? isDark
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  : isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Mobile App & QR Scanner Promo Card in Sidebar (Always Visible) */}
      <div className={`p-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <InstallAppButton variant="sidebar" />
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className={`text-[11px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          <p>Privacy-first • Local storage</p>
          <p className="mt-1">No data sent to servers</p>
        </div>
      </div>
    </aside>
  );
}
