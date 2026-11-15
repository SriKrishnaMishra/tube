import { motion } from 'framer-motion';
import { ArrowRight, Shield, Brain, BarChart3, Eye, Zap, Lock, Download } from 'lucide-react';
import { downloadExtensionZip } from '../utils/extensionZip';

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
              <Zap size={12} />
              AI-Powered • Privacy-First • Local Storage
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Take Control of
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Recommendations
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Track, understand, personalize, and control what you consume online.
            An intelligent recommendation management tool for YouTube and beyond.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={downloadExtensionZip}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <Download size={16} />
              Download Extension (.zip)
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors"
            >
              Open Dashboard Demo
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Core Features</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Everything you need to understand and control your content recommendations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Eye className="text-indigo-400" size={22} />}
              title="Recommendation Tracking"
              description="Track viewed videos, music, and recommended content. Collect titles, categories, channels, and engagement data."
            />
            <FeatureCard
              icon={<Brain className="text-purple-400" size={22} />}
              title="AI Recommendations"
              description="Get personalized content suggestions based on your interests using content-based filtering and ML."
            />
            <FeatureCard
              icon={<Shield className="text-emerald-400" size={22} />}
              title="Smart Blocking"
              description="Block specific keywords, topics, channels, and categories. Automatically hide matching recommendations."
            />
            <FeatureCard
              icon={<Zap className="text-amber-400" size={22} />}
              title="Content Browser"
              description="Search and filter all your tracked content. Find exactly what you want to watch with advanced filters."
            />
            <FeatureCard
              icon={<BarChart3 className="text-pink-400" size={22} />}
              title="Smart Discovery"
              description="Discover content based on your mood, preferred categories, and duration. AI-powered content matching."
            />
            <FeatureCard
              icon={<Lock className="text-cyan-400" size={22} />}
              title="Full-Stack API"
              description="FastAPI backend with SQLite. Sync across devices, real-time recommendations, and advanced analytics."
            />
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <TechBadge label="Chrome MV3" />
              <TechBadge label="React + TS" />
              <TechBadge label="Tailwind CSS" />
              <TechBadge label="IndexedDB" />
              <TechBadge label="FastAPI" />
              <TechBadge label="SQLite/PostgreSQL" />
              <TechBadge label="Content Scripts" />
              <TechBadge label="AI/ML Ready" />
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-semibold mb-3">Development Roadmap</h3>
              <div className="space-y-3">
                <RoadmapItem phase="Phase 1" title="MVP + API" status="current" description="Chrome extension, FastAPI backend, content tracking, smart blocking, content browser" />
                <RoadmapItem phase="Phase 2" title="AI Intelligence" status="next" description="ML-powered recommendations, interest profiling, content-based filtering, mood detection" />
                <RoadmapItem phase="Phase 3" title="Multi-Platform" status="future" description="Spotify & Netflix support, cross-device sync, advanced analytics dashboard" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-2 text-center">📥 Install in 3 Steps</h2>
            <p className="text-sm text-gray-400 text-center mb-8">Download the ZIP, extract it, load it into Chrome</p>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                <div>
                  <p className="font-medium text-sm">Download & Extract</p>
                  <p className="text-xs text-gray-500 mt-1">Click the download button above to get the ZIP file. Extract it to any folder on your computer.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                <div>
                  <p className="font-medium text-sm">Open Chrome Extensions</p>
                  <p className="text-xs text-gray-500 mt-1">Go to <code className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-400">chrome://extensions/</code> and enable <strong>Developer mode</strong> (toggle in top-right corner).</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                <div>
                  <p className="font-medium text-sm">Load Unpacked Extension</p>
                  <p className="text-xs text-gray-500 mt-1">Click <strong>"Load unpacked"</strong> button → select the <strong>extracted folder</strong> (the one containing <code className="px-1 py-0.5 rounded bg-white/10 text-indigo-400">manifest.json</code>). Done!</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={downloadExtensionZip}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20"
              >
                <Download size={16} />
                Download Extension ZIP
              </button>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-300">
                <strong>⚠️ Important:</strong> When Chrome asks you to select a folder, choose the <strong>extracted folder itself</strong> (not a parent folder). It must contain <code className="px-1 py-0.5 rounded bg-white/10">manifest.json</code> directly inside it.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to take control?</h2>
            <p className="text-gray-400 mb-8">
              Try the interactive demo dashboard or install the extension to start tracking your recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={downloadExtensionZip}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                <Download size={16} />
                Download Extension (.zip)
              </button>
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-all"
              >
                Launch Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-medium">RecTracker</span>
          </div>
          <p className="text-xs text-gray-600">
            Privacy-first • Open Source • Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TechBadge({ label }: { label: string }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
      <span className="text-xs font-medium text-gray-400">{label}</span>
    </div>
  );
}

function RoadmapItem({ phase, title, status, description }: { phase: string; title: string; status: 'current' | 'next' | 'future'; description: string }) {
  const colors = {
    current: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    next: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    future: 'bg-white/5 border-white/10 text-gray-500',
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${colors[status]}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5">{phase}</span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs opacity-70 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
