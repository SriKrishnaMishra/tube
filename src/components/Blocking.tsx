import { useState } from 'react';
import { BlockRule } from '../types';
import { Plus, Trash2, ShieldOff, Search } from 'lucide-react';

interface BlockingProps {
  rules: BlockRule[];
  onAdd: (rule: Omit<BlockRule, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

export function Blocking({ rules, onAdd, onDelete }: BlockingProps) {
  const [type, setType] = useState<'keyword' | 'channel' | 'category'>('keyword');
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd({ type, value: value.trim() });
    setValue('');
  };

  const filteredRules = rules.filter((r) =>
    r.value.toLowerCase().includes(search.toLowerCase())
  );

  const quickSuggestions = [
    { type: 'keyword' as const, value: 'clickbait' },
    { type: 'keyword' as const, value: 'shorts' },
    { type: 'channel' as const, value: 'spam channel' },
    { type: 'category' as const, value: 'gaming' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Content Blocking</h2>
        <p className="text-sm text-gray-500 mt-1">
          Block keywords, channels, or categories from appearing in your feed
        </p>
      </div>

      {/* Add Rule Form */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} className="text-indigo-400" />
          Add Block Rule
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="keyword">Keyword</option>
            <option value="channel">Channel</option>
            <option value="category">Category</option>
          </select>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              type === 'keyword'
                ? 'e.g. clickbait, shorts, drama...'
                : type === 'channel'
                ? 'e.g. channel name...'
                : 'e.g. gaming, music, news...'
            }
            className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            Add Rule
          </button>
        </form>

        {/* Quick suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Quick add:</span>
          {quickSuggestions.map((s) => (
            <button
              key={s.value}
              onClick={() => onAdd(s)}
              className="text-[11px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {s.type}: {s.value}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <ShieldOff size={16} className="text-amber-400" />
            Active Rules ({rules.length})
          </h3>
          {rules.length > 3 && (
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rules..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs outline-none focus:border-indigo-500 w-40"
              />
            </div>
          )}
        </div>

        <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
          {filteredRules.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              {rules.length === 0
                ? 'No blocking rules yet. Add one above to start filtering content.'
                : 'No matching rules found.'}
            </div>
          ) : (
            filteredRules.map((rule) => (
              <div key={rule.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                    rule.type === 'keyword'
                      ? 'bg-blue-500/10 text-blue-400'
                      : rule.type === 'channel'
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {rule.type}
                  </span>
                  <span className="text-sm">{rule.value}</span>
                </div>
                <button
                  onClick={() => onDelete(rule.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
        <p className="text-xs text-indigo-300">
          <strong>How it works:</strong> In the Chrome extension, blocking rules are applied in real-time
          to YouTube's recommendation feed. Matching content is hidden without affecting page functionality.
          Rules are stored locally and never sent to external servers.
        </p>
      </div>
    </div>
  );
}
