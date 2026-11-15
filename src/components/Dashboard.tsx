import { DashboardStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Video, ShieldOff, Zap, RefreshCw } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats | null;
  onSimulate: () => void;
  onPlayInModal?: (record: any) => void;
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#4f46e5'];

export function Dashboard({ stats, onSimulate, onPlayInModal }: DashboardProps) {
  if (!stats) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Your recommendation overview at a glance</p>
        </div>
        <button
          onClick={onSimulate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Simulate Activity
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Video size={18} className="text-indigo-400" />}
          label="Tracked Videos"
          value={stats.total}
          color="indigo"
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-400" />}
          label="Top Category"
          value={stats.topCategories[0]?.category || '—'}
          color="emerald"
        />
        <StatCard
          icon={<ShieldOff size={18} className="text-amber-400" />}
          label="Block Rules"
          value={stats.blockedCount}
          color="amber"
        />
        <StatCard
          icon={<Zap size={18} className="text-purple-400" />}
          label="Top Channel"
          value={stats.topChannels[0]?.channel || '—'}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Activity */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold mb-4">Daily Activity</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyActivity}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    <span key="val" style={{ color: '#ffffff', fontWeight: 700 }}>{value}</span>,
                    <span key="name" style={{ color: '#c7d2fe', fontWeight: 600 }}>{name}</span>,
                  ]}
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                  labelStyle={{ color: '#818cf8', fontWeight: 700 }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Channels Pie */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold mb-4">Top Channels</h3>
          <div className="h-48 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topChannels}
                  dataKey="count"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {stats.topChannels.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [
                    <span key="val" style={{ color: '#ffffff', fontWeight: 700 }}>{value}</span>,
                    <span key="name" style={{ color: '#c7d2fe', fontWeight: 600 }}>{name}</span>,
                  ]}
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                  labelStyle={{ color: '#818cf8', fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Channels & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold mb-3">Top Channels</h3>
          <div className="space-y-2">
            {stats.topChannels.map((ch, i) => (
              <div key={ch.channel} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{i + 1}.</span>
                  <span className="text-sm">{ch.channel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${(ch.count / stats.topChannels[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6 text-right">{ch.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.recent.slice(0, 8).map((r) => {
              const youtubeUrl = r.url || (r.videoId ? `https://www.youtube.com/watch?v=${r.videoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${r.channel} ${r.title}`)}`);
              return (
                <div
                  key={r.id}
                  onClick={() => onPlayInModal && onPlayInModal(r)}
                  className="flex items-center justify-between py-1.5 hover:bg-white/[0.04] px-2 rounded-lg transition-colors group cursor-pointer"
                  title="Play video on website"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate group-hover:text-emerald-300 transition-colors font-medium">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.channel}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2 shrink-0">
                    ▶ Play
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const bgMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    amber: 'bg-amber-500/10 border-amber-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className={`rounded-xl border p-4 ${bgMap[color] || bgMap.indigo}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-xl font-bold truncate">{value}</p>
    </div>
  );
}
