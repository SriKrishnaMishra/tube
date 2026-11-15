// ============================================================
// RecTracker — Enhanced Popup Script
// Rich YouTube data display with thumbnails, stats, etc.
// ============================================================
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  let allVideos = [];
  let currentFilter = 'all';
  let currentSearch = '';
  let displayedCount = 0;
  const PAGE_SIZE = 15;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  }

  function formatDuration(seconds) {
    if (!seconds) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function formatWatchTime(totalSeconds) {
    if (!totalSeconds) return '0m';
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }

  // ---------- Theme ----------
  async function initTheme() {
    const stored = await chrome.storage.local.get('theme');
    document.documentElement.dataset.theme = stored.theme || 'dark';
  }

  async function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    await chrome.storage.local.set({ theme: next });
  }

  // ---------- Tabs ----------
  function initTabs() {
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        $('panel-' + tab.dataset.tab).classList.add('active');
        if (tab.dataset.tab === 'videos') renderVideoGrid();
      });
    });
  }

  // ---------- Renderers ----------
  function renderStats(stats, rules) {
    $('statTotal').textContent = stats.total || 0;
    
    // Calculate watch time
    const totalDuration = (stats.recent || []).reduce((sum, v) => sum + (v.duration || 0), 0);
    $('statWatchTime').textContent = formatWatchTime(totalDuration);
    
    // Count unique channels
    const channels = new Set((stats.recent || []).map(v => v.channel));
    $('statChannels').textContent = channels.size;
    
    $('statBlocked').textContent = rules.length;
    $('settingsTotal').textContent = stats.total || 0;
    $('settingsWatchTime').textContent = formatWatchTime(totalDuration);
    $('rulesCount').textContent = rules.length;
  }

  function renderCategories(stats) {
    const el = $('categoriesList');
    const categoryMap = {};
    (stats.recent || []).forEach(v => {
      if (v.category && v.category !== 'Other') {
        categoryMap[v.category] = (categoryMap[v.category] || 0) + 1;
      }
    });
    
    const categories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    $('categoryCount').textContent = categories.length;
    
    if (categories.length === 0) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">📂</div>Browse YouTube to see categories</div>';
      return;
    }
    
    el.innerHTML = categories.map(([cat, count]) =>
      `<div class="tag-item">
        <span>${escapeHtml(cat)}</span>
        <span class="tag-count">${count}</span>
      </div>`
    ).join('');
  }

  function renderTopChannels(stats) {
    const el = $('topChannels');
    if (!stats.topChannels || stats.topChannels.length === 0) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">📺</div>No channels tracked yet</div>';
      return;
    }
    
    el.innerHTML = stats.topChannels.slice(0, 8).map((c, i) =>
      `<div class="channel-item">
        <div class="channel-rank">${i + 1}</div>
        <div class="channel-name">${escapeHtml(c.channel)}</div>
        <div class="channel-count">${c.count} videos</div>
      </div>`
    ).join('');
  }

  function renderRecentVideos(stats) {
    const el = $('recentVideos');
    if (!stats.recent || stats.recent.length === 0) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">🎬</div>Browse YouTube to start tracking</div>';
      return;
    }
    
    el.innerHTML = stats.recent.slice(0, 6).map(v => renderVideoCard(v)).join('');
    
    // Add click handlers
    el.querySelectorAll('.video-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        const video = stats.recent[i];
        if (video?.url) chrome.tabs.create({ url: video.url });
      });
    });
  }

  function renderVideoCard(v) {
    const thumb = v.thumbnail || `https://i.ytimg.com/vi/${v.videoId || v.video_id}/mqdefault.jpg`;
    const duration = v.durationText || formatDuration(v.duration);
    
    return `<div class="video-item" data-url="${escapeHtml(v.url || '')}">
      <div class="video-thumb">
        <img src="${escapeHtml(thumb)}" alt="" onerror="this.style.display='none'">
        ${duration ? `<span class="video-duration">${escapeHtml(duration)}</span>` : ''}
      </div>
      <div class="video-info">
        <div class="video-title">${escapeHtml(v.title)}</div>
        <div class="video-meta">
          <span class="video-channel">${escapeHtml(v.channel)}</span>
          ${v.category ? `<span class="video-category">${escapeHtml(v.category)}</span>` : ''}
          ${v.views ? `<span>${escapeHtml(v.views)}</span>` : ''}
        </div>
      </div>
    </div>`;
  }

  // ---------- Video Grid (Videos tab) ----------
  function renderVideoGrid() {
    const el = $('videoGrid');
    let filtered = allVideos;
    
    // Apply source filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(v => v.source === currentFilter);
    }
    
    // Apply search
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q) ||
        (v.category || '').toLowerCase().includes(q)
      );
    }
    
    if (filtered.length === 0) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">🔍</div>No videos found</div>';
      $('loadMoreWrap').style.display = 'none';
      return;
    }
    
    displayedCount = Math.min(PAGE_SIZE, filtered.length);
    el.innerHTML = filtered.slice(0, displayedCount).map(v => renderVideoCard(v)).join('');
    
    // Show load more if needed
    $('loadMoreWrap').style.display = filtered.length > PAGE_SIZE ? 'block' : 'none';
    
    // Add click handlers
    el.querySelectorAll('.video-item').forEach((item) => {
      item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) chrome.tabs.create({ url });
      });
    });
  }

  function loadMore() {
    const el = $('videoGrid');
    let filtered = allVideos;
    if (currentFilter !== 'all') filtered = filtered.filter(v => v.source === currentFilter);
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q)
      );
    }
    
    const nextBatch = filtered.slice(displayedCount, displayedCount + PAGE_SIZE);
    el.innerHTML += nextBatch.map(v => renderVideoCard(v)).join('');
    displayedCount += nextBatch.length;
    
    if (displayedCount >= filtered.length) {
      $('loadMoreWrap').style.display = 'none';
    }
    
    // Add click handlers to new items
    el.querySelectorAll('.video-item:not([data-bound])').forEach((item) => {
      item.setAttribute('data-bound', '1');
      item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) chrome.tabs.create({ url });
      });
    });
  }

  // ---------- Rules ----------
  function renderRules(rules) {
    const el = $('rulesList');
    if (!rules || rules.length === 0) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">🛡️</div>No blocking rules yet</div>';
      return;
    }
    
    el.innerHTML = rules.map(r =>
      `<div class="rule-item">
        <span class="rule-type ${r.type}">${r.type}</span>
        <span class="rule-value">${escapeHtml(r.value)}</span>
        <button class="rule-delete" data-id="${r.id}">×</button>
      </div>`
    ).join('');
    
    el.querySelectorAll('.rule-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        await chrome.runtime.sendMessage({
          type: 'DELETE_BLOCK_RULE',
          payload: { id: Number(btn.dataset.id) }
        });
        refresh();
      });
    });
  }

  function renderBlockStats(stats, rules) {
    const el = $('blockStats');
    const keywordRules = rules.filter(r => r.type === 'keyword').length;
    const channelRules = rules.filter(r => r.type === 'channel').length;
    const categoryRules = rules.filter(r => r.type === 'category').length;
    
    el.innerHTML = `
      <div class="block-stat-item">
        <div class="block-stat-value">${keywordRules}</div>
        <div class="block-stat-label">Keywords</div>
      </div>
      <div class="block-stat-item">
        <div class="block-stat-value">${channelRules}</div>
        <div class="block-stat-label">Channels</div>
      </div>
      <div class="block-stat-item">
        <div class="block-stat-value">${categoryRules}</div>
        <div class="block-stat-label">Categories</div>
      </div>
      <div class="block-stat-item">
        <div class="block-stat-value">${stats.total || 0}</div>
        <div class="block-stat-label">Tracked</div>
      </div>
    `;
  }

  // ---------- Data ----------
  async function refresh() {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
      if (!res?.ok) return;
      
      allVideos = res.stats.recent || [];
      renderStats(res.stats, res.rules);
      renderCategories(res.stats);
      renderTopChannels(res.stats);
      renderRecentVideos(res.stats);
      renderRules(res.rules);
      renderBlockStats(res.stats, res.rules);
      renderVideoGrid();
      
      $('footerStatus').textContent = `${allVideos.length} videos tracked`;
    } catch (err) {
      console.warn('[RT] refresh failed:', err);
    }
  }

  // ---------- Block Form ----------
  function initBlockForm() {
    $('blockForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = $('blockType').value;
      const value = $('blockValue').value.trim();
      if (!value) return;
      await chrome.runtime.sendMessage({
        type: 'ADD_BLOCK_RULE',
        payload: { type, value, createdAt: Date.now() },
      });
      $('blockValue').value = '';
      refresh();
    });

    // Quick tags
    document.querySelectorAll('.quick-tag').forEach(tag => {
      tag.addEventListener('click', async () => {
        const type = tag.dataset.type;
        const value = tag.dataset.value;
        await chrome.runtime.sendMessage({
          type: 'ADD_BLOCK_RULE',
          payload: { type, value, createdAt: Date.now() },
        });
        refresh();
      });
    });
  }

  // ---------- Filters ----------
  function initFilters() {
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
        displayedCount = 0;
        renderVideoGrid();
      });
    });

    $('videoSearch').addEventListener('input', (e) => {
      currentSearch = e.target.value;
      displayedCount = 0;
      renderVideoGrid();
    });

    $('loadMoreBtn').addEventListener('click', loadMore);
    $('viewAllBtn').addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelector('[data-tab="videos"]').classList.add('active');
      $('panel-videos').classList.add('active');
      renderVideoGrid();
    });
  }

  // ---------- Settings ----------
  function initSettings() {
    $('clearAllBtn').addEventListener('click', async () => {
      if (!confirm('Clear all data? This cannot be undone.')) return;
      await chrome.runtime.sendMessage({ type: 'CLEAR_ALL' });
      allVideos = [];
      refresh();
    });

    $('exportBtn').addEventListener('click', async () => {
      const data = {
        videos: allVideos,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rectracker-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ---------- Init ----------
  (async () => {
    await initTheme();
    $('themeToggle').addEventListener('click', toggleTheme);
    initTabs();
    initBlockForm();
    initFilters();
    initSettings();
    await refresh();
    setInterval(refresh, 3000);
  })();
})();
