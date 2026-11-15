import { useState, useEffect, useCallback, useMemo } from 'react';
import { TabId, ThemeMode, ContentRecord, BlockRule, DashboardStats } from './types';
import { generateMockRecords, computeStats, shouldBlock } from './store';
import { THEMES } from './themeConfig';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Tracking } from './components/Tracking';
import { Blocking } from './components/Blocking';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { LandingHero } from './components/LandingHero';
import { ContentBrowser } from './components/ContentBrowser';
import { AIRecommendations } from './components/AIRecommendations';
import { SmartDiscovery } from './components/SmartDiscovery';
import { ChannelHub } from './components/ChannelHub';
import { ThemeSelector } from './components/ThemeSelector';
import { InstallAppButton } from './components/InstallAppButton';
import { NotificationCenter } from './components/NotificationCenter';
import { GlobalSearch } from './components/GlobalSearch';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { Menu, RotateCcw, Sun, Moon } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app-theme') as ThemeMode;
    return saved && THEMES[saved] ? saved : 'dark';
  });
  const [activeTab, setActiveTab] = useState<TabId>('channels');
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [rules, setRules] = useState<BlockRule[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModalVideo, setActiveModalVideo] = useState<ContentRecord | null>(null);
  const [focusedCreator, setFocusedCreator] = useState<string | null>(null);
  const [deletedVideoIds, setDeletedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('deleted-video-ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleDeleteRecord = useCallback((id: string) => {
    setDeletedVideoIds((prev) => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      try {
        localStorage.setItem('deleted-video-ids', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save deleted ids', e);
      }
      return updated;
    });
    setRecords((prev) => prev.filter((r) => r.id !== id && r.videoId !== id));
  }, []);

  const handleRestoreRecord = useCallback((id: string) => {
    if (id === '__all__') {
      try {
        localStorage.removeItem('deleted-video-ids');
      } catch (e) {
        console.warn(e);
      }
      setDeletedVideoIds([]);
      setRecords(generateMockRecords(35));
      return;
    }
    setDeletedVideoIds((prev) => {
      const updated = prev.filter((x) => x !== id);
      try {
        localStorage.setItem('deleted-video-ids', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not restore id', e);
      }
      return updated;
    });
  }, []);

  const loadAllCatalogRecords = useCallback(() => {
    try {
      localStorage.removeItem('deleted-video-ids');
    } catch (e) {
      console.warn(e);
    }
    setDeletedVideoIds([]);

    const catalog = generateMockRecords(35);
    setRecords(catalog);

    // Dispatch real-time Cloudflare notification alert
    fetch('/api/notifications/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '⚡ Catalog Synced via Cloudflare',
        message: `${catalog.length}+ masterclasses refreshed with fresh today & weekly content!`,
        type: 'success',
      }),
    }).catch(() => {});

    fetch('/api/apify/items')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.items && data.items.length > 0) {
          setRecords((prev) => {
            const existing = new Set(prev.map((r) => r.videoId));
            const newItems = data.items.filter((it: ContentRecord) => !existing.has(it.videoId));
            return [...newItems, ...prev];
          });
        }
      })
      .catch((err) => console.warn('Could not load Apify items:', err));
  }, []);

  useEffect(() => {
    loadAllCatalogRecords();
  }, [loadAllCatalogRecords]);

  useEffect(() => {
    if (records.length > 0) {
      setStats(computeStats(records, rules));
    }
  }, [records, rules]);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.classList.toggle('dark', theme !== 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((newTheme?: ThemeMode) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    }
  }, []);

  const addRule = useCallback((rule: Omit<BlockRule, 'id' | 'createdAt'>) => {
    const newRule: BlockRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setRules((prev) => [...prev, newRule]);
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setRecords([]);
    setRules([]);
    setStats(null);
  }, []);

  const addMockRecords = useCallback(() => {
    const newRecords = generateMockRecords(20);
    setRecords((prev) => [...newRecords, ...prev]);
  }, []);

  const deletedSet = useMemo(() => new Set(deletedVideoIds), [deletedVideoIds]);
  const filteredRecords = records.filter(
    (r) => !shouldBlock(r, rules) && !deletedSet.has(r.id) && !deletedSet.has(r.videoId)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'channels':
        return (
          <ChannelHub
            records={filteredRecords}
            onPlayInModal={(rec) => setActiveModalVideo(rec)}
            focusedCreator={focusedCreator}
            onClearFocusedCreator={() => setFocusedCreator(null)}
            onDeleteRecord={handleDeleteRecord}
            onRestoreRecord={handleRestoreRecord}
            onReloadCatalog={loadAllCatalogRecords}
          />
        );
      case 'landing':
        return <LandingHero onGetStarted={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <Dashboard stats={stats} onSimulate={addMockRecords} onPlayInModal={(rec) => setActiveModalVideo(rec)} />;
      case 'browser':
        return (
          <ContentBrowser
            records={filteredRecords}
            onPlayInModal={(rec) => setActiveModalVideo(rec)}
            onDeleteRecord={handleDeleteRecord}
            onRestoreRecord={handleRestoreRecord}
          />
        );
      case 'recommendations':
        return (
          <AIRecommendations
            stats={stats}
            records={filteredRecords}
            rules={rules}
            theme={theme}
            onSelectTheme={setTheme}
            onPlayInModal={(rec) => setActiveModalVideo(rec)}
          />
        );
      case 'discovery':
        return (
          <SmartDiscovery
            records={filteredRecords}
            rules={rules}
            stats={stats}
            onPlayInModal={(rec) => setActiveModalVideo(rec)}
          />
        );
      case 'tracking':
        return <Tracking records={filteredRecords} total={records.length} blocked={rules.length} onPlayInModal={(rec) => setActiveModalVideo(rec)} />;
      case 'blocking':
        return <Blocking rules={rules} onAdd={addRule} onDelete={deleteRule} />;
      case 'analytics':
        return <Analytics stats={stats} records={filteredRecords} />;
      case 'settings':
        return <Settings onClear={clearAll} theme={theme} onToggleTheme={(t) => t ? setTheme(t) : toggleTheme()} />;
      default:
        return null;
    }
  };

  const currentThemeDef = THEMES[theme] || THEMES.dark;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentThemeDef.bgClass} ${currentThemeDef.textClass}`}>
      {activeTab === 'landing' ? (
        <div className="relative">
          <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <span className="font-semibold text-lg">RecTracker</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTheme()}
                  className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                >
                  Open Dashboard
                </button>
              </div>
            </div>
          </header>
          {renderContent()}
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab: TabId) => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              theme={theme}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className={`relative z-[100] h-16 border-b flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6 ${currentThemeDef.headerBgClass} backdrop-blur-xl`}>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/5"
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-sm font-bold capitalize hidden md:block text-white">{activeTab}</h1>
              </div>

              {/* Real-time Global Search */}
              <div className="flex-1 min-w-0 max-w-lg mx-1 sm:mx-3">
                <GlobalSearch
                  records={records}
                  onPlayInModal={(rec) => setActiveModalVideo(rec)}
                  onOpenCreator={(creatorName) => {
                    setFocusedCreator(creatorName);
                    setActiveTab('channels');
                  }}
                />
              </div>

              {/* Right Action Bar (Clean & Streamlined) */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={loadAllCatalogRecords}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-300 hover:text-white transition-colors font-medium flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                  title="Reload and re-sync all YouTube videos and channels"
                >
                  <RotateCcw size={12} />
                  <span className="hidden lg:inline">Reload Videos</span>
                </button>
                <NotificationCenter />
                <ThemeSelector currentTheme={theme} onSelectTheme={setTheme} />
                <button
                  onClick={() => setActiveTab('landing')}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-medium hidden sm:inline-block shrink-0"
                >
                  Home
                </button>
              </div>
            </header>
            <main className="relative z-10 isolate flex-1 overflow-y-auto p-4 lg:p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      )}

      {/* Embedded Real-time Video Player Modal with Related Videos shelf */}
      <VideoPlayerModal
        record={activeModalVideo}
        onClose={() => setActiveModalVideo(null)}
        allRecords={filteredRecords}
        onSelectVideo={(rec) => setActiveModalVideo(rec)}
      />
    </div>
  );
}
