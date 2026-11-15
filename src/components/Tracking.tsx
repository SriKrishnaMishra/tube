import { ContentRecord } from '../types';
import { Eye, Clock, Tag } from 'lucide-react';

interface TrackingProps {
  records: ContentRecord[];
  total: number;
  blocked: number;
  onPlayInModal?: (record: ContentRecord) => void;
}

export function Tracking({ records, total, blocked, onPlayInModal }: TrackingProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Tracking</h2>
        <p className="text-sm text-gray-500 mt-1">
          {records.length} visible items • {total - records.length} blocked by rules
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-indigo-400" />
            <span className="text-xs text-gray-400">Total Tracked</span>
          </div>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-emerald-400" />
            <span className="text-xs text-gray-400">Visible</span>
          </div>
          <p className="text-2xl font-bold">{records.length}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-amber-400" />
            <span className="text-xs text-gray-400">Active Rules</span>
          </div>
          <p className="text-2xl font-bold">{blocked}</p>
        </div>
      </div>

      {/* Content List */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-semibold">Content Feed</h3>
        </div>
        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
          {records.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No content tracked yet. Browse YouTube to start tracking.
            </div>
          ) : (
            records.map((record) => {
              const youtubeUrl = record.url || (record.videoId ? `https://www.youtube.com/watch?v=${record.videoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(`${record.channel} ${record.title}`)}`);
              return (
                <div
                  key={record.id}
                  onClick={() => onPlayInModal && onPlayInModal(record)}
                  className="px-4 py-3 hover:bg-white/[0.04] transition-colors block group cursor-pointer"
                  title="Play video on website"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">{record.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{record.channel}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                          {record.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                        {record.source}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
