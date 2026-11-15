import { useState } from 'react';
import { DOMAINS, SUBCATEGORIES, getCategoriesByDomain, getAffinityCategories, getCategoryById } from '../taxonomy';
import { Layers, Link as LinkIcon, Search, X, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface TaxonomyBarProps {
  selectedDomain: string;
  selectedSubcategoryId?: number;
  onSelectDomain: (domainId: string) => void;
  onSelectSubcategory: (subcategoryId: number | undefined) => void;
}

export function TaxonomyBar({
  selectedDomain,
  selectedSubcategoryId,
  onSelectDomain,
  onSelectSubcategory,
}: TaxonomyBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCategories = searchQuery.trim()
    ? SUBCATEGORIES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.domainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : selectedDomain && selectedDomain !== 'all'
    ? getCategoriesByDomain(selectedDomain)
    : SUBCATEGORIES;

  const activeCategory = selectedSubcategoryId ? getCategoryById(selectedSubcategoryId) : undefined;
  const affinities = selectedSubcategoryId ? getAffinityCategories(selectedSubcategoryId) : [];

  const domainStyles: Record<string, { active: string; inactive: string; border: string }> = {
    'ai-ml': {
      active: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/40 border-purple-400',
      inactive: 'bg-purple-950/20 border-purple-500/30 text-purple-300 hover:bg-purple-900/30 hover:border-purple-400',
      border: 'border-purple-500/30',
    },
    'languages': {
      active: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/40 border-blue-400',
      inactive: 'bg-blue-950/20 border-blue-500/30 text-blue-300 hover:bg-blue-900/30 hover:border-blue-400',
      border: 'border-blue-500/30',
    },
    'web-dev': {
      active: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/40 border-cyan-400',
      inactive: 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/30 hover:border-cyan-400',
      border: 'border-cyan-500/30',
    },
    'mobile-dev': {
      active: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/40 border-pink-400',
      inactive: 'bg-pink-950/20 border-pink-500/30 text-pink-300 hover:bg-pink-900/30 hover:border-pink-400',
      border: 'border-pink-500/30',
    },
    'cloud-devops': {
      active: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/40 border-sky-400',
      inactive: 'bg-sky-950/20 border-sky-500/30 text-sky-300 hover:bg-sky-900/30 hover:border-sky-400',
      border: 'border-sky-500/30',
    },
    'security-data': {
      active: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40 border-emerald-400',
      inactive: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30 hover:border-emerald-400',
      border: 'border-emerald-500/30',
    },
    'emerging-tech': {
      active: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/40 border-amber-400',
      inactive: 'bg-amber-950/20 border-amber-500/30 text-amber-300 hover:bg-amber-900/30 hover:border-amber-400',
      border: 'border-amber-500/30',
    },
    'ux-practice': {
      active: 'bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white shadow-lg shadow-rose-500/40 border-rose-400',
      inactive: 'bg-rose-950/20 border-rose-500/30 text-rose-300 hover:bg-rose-900/30 hover:border-rose-400',
      border: 'border-rose-500/30',
    },
  };

  return (
    <div className="space-y-4 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/15 via-slate-900/50 to-purple-950/15 p-5 backdrop-blur-xl shadow-xl">
      {/* Search & Overview Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white flex items-center gap-2">
              57-Category Developer Item Taxonomy
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                8 Domains
              </span>
            </span>
            <p className="text-[11px] text-gray-400">Click any domain or subcategory to filter recommendations</p>
          </div>
        </div>

        {/* Quick search input */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 57 categories (e.g. Python, Docker)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs text-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 placeholder-gray-400 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Domain Pills (Level 1) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => {
            onSelectDomain('all');
            onSelectSubcategory(undefined);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            selectedDomain === 'all'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 border-indigo-400 scale-[1.02]'
              : 'bg-slate-900/60 border-white/10 text-gray-300 hover:bg-slate-800 hover:border-indigo-400/50'
          }`}
        >
          <span>🌐</span>
          <span>All Domains</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white ml-0.5">57</span>
        </button>

        {DOMAINS.map((dom) => {
          const isActive = selectedDomain === dom.id;
          const style = domainStyles[dom.id] || domainStyles['ai-ml'];
          const count = getCategoriesByDomain(dom.id).length;
          return (
            <button
              key={dom.id}
              onClick={() => {
                onSelectDomain(dom.id);
                onSelectSubcategory(undefined);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? `${style.active} scale-[1.02]`
                  : `${style.inactive} hover:scale-[1.01]`
              }`}
            >
              <span className="text-sm">{dom.icon}</span>
              <span>{dom.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono ml-0.5">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills (Level 2) */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-slate-900/80 p-4 shadow-inner">
        <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 mb-3 font-semibold flex-wrap gap-2">
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            Showing {visibleCategories.length} Subcategories
            {selectedDomain !== 'all' ? ` in ${DOMAINS.find((d) => d.id === selectedDomain)?.name}` : ''}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1 text-xs cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={13} />
                  <span>Collapse View</span>
                </>
              ) : (
                <>
                  <ChevronDown size={13} />
                  <span>Show All ({visibleCategories.length})</span>
                </>
              )}
            </button>

            {selectedSubcategoryId && (
              <button
                onClick={() => onSelectSubcategory(undefined)}
                className="text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1 text-xs cursor-pointer"
              >
                <X size={12} /> Clear Filter
              </button>
            )}
          </div>
        </div>

        <div className={`flex flex-wrap gap-2 pr-1 transition-all ${isExpanded ? 'max-h-none' : 'max-h-48 overflow-y-auto scrollbar-thin'}`}>
          {visibleCategories.map((cat) => {
            const isSelected = selectedSubcategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectSubcategory(isSelected ? undefined : cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all border font-semibold cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold border-indigo-400 shadow-md shadow-indigo-500/40 ring-2 ring-indigo-400/40 scale-[1.03]'
                    : 'bg-white dark:bg-slate-800/90 border-gray-200 dark:border-white/15 text-gray-800 dark:text-slate-100 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-white shadow-sm'
                }`}
                title={cat.description}
              >
                <span className="text-[10px] opacity-80 font-mono font-bold">#{cat.id}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Affinity Pairs Banner */}
      {activeCategory && affinities.length > 0 && (
        <div className="rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-indigo-950/60 p-4 flex flex-wrap items-center gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-purple-200 font-bold">
            <LinkIcon size={16} className="text-purple-400" />
            <span>Suggested Affinity Pairs for #{activeCategory.id} ({activeCategory.name}):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {affinities.map((aff) => (
              <button
                key={aff.id}
                onClick={() => onSelectSubcategory(aff.id)}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 hover:bg-purple-500 hover:text-white border border-purple-500/40 shadow-sm transition-all"
                title={aff.description}
              >
                #{aff.id} {aff.name} ↔
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
