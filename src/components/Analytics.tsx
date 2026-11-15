import { DashboardStats, ContentRecord } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { Brain, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  stats: DashboardStats | null;
  records: ContentRecord[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#4f46e5', '#7c3aed', '#5b21b6'];

export function Analytics({ stats, records }: AnalyticsProps) {
  if (!stats) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  // Build radar data for categories
  const radarData = stats.topCategories.map((c) => ({
    category: c.category,
    count: c.count,
    fullMark: Math.max(...stats.topCategories.map((x) => x.count)),
  }));

  // Source distribution
  const sourceData = Object.entries(stats.sourceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Interest profile
  const interestProfile = stats.topCategories.map((c) => ({
    name: c.category,
    interest: Math.min(100, Math.round((c.count / stats.total) * 100 * 3)),
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Deep insights into your consumption patterns</p>
      </div>

      {/* Interest Profile */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Brain size={16} className="text-purple-400" />
          AI Interest Profile
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {interestProfile.map((item) => (
            <div key={item.name} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeDasharray={`${item.interest}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {item.interest}%
                </span>
              </div>
              <p className="text-[11px] text-gray-400">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Radar */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            Category Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar
                  name="Views"
                  dataKey="count"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Pie */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold mb-4">Source Distribution</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceData.map((_, i) => (
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

        {/* Area Chart - Trend */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Consumption Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyActivity}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Brain size={16} className="text-purple-400" />
          AI Recommendations (Phase 2 Preview)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Based on your interest profile, the AI engine would recommend content from these areas:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.topCategories.slice(0, 3).map((cat) => (
            <div key={cat.category} className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <p className="text-sm font-medium">{cat.category}</p>
              <p className="text-xs text-gray-500 mt-1">
                {cat.count} videos watched • High interest score
              </p>
              <div className="mt-2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i < Math.ceil(cat.count / 5) ? 'bg-purple-400' : 'bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
