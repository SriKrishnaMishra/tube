// ============================================================
// RecTracker — Enhanced Content Script
// Extracts rich YouTube data: thumbnails, duration, views, etc.
// ============================================================
(function () {
  'use strict';

  const SELECTORS = {
    // Grid items (home feed)
    gridItem: 'ytd-rich-item-renderer',
    // Sidebar recommendations
    sidebarItem: 'ytd-compact-video-renderer',
    // Search results
    searchItem: 'ytd-video-renderer',
    // Trending
    trendingItem: 'ytd-video-renderer',

    // Data selectors
    title: '#video-title, a#video-title-link, #video-title-link',
    channel: 'ytd-channel-name a, #channel-name a, .ytd-channel-name a',
    link: 'a[href*="/watch?v="], a.ytd-thumbnail',
    thumbnail: 'img.yt-core-image, img#img, yt-image img',
    duration: 'span.ytd-thumbnail-overlay-time-status-renderer, #overlays span[aria-label], .ytd-thumbnail-overlay-time-status-renderer',
    views: '#metadata-line span, .inline-metadata-item, #metadata-line .inline-metadata-item',
    metadata: '#metadata-line',
    badge: '.badge-style-type-simple, ytd-badge-supported-renderer .badge',
    timeAgo: '#metadata-line span:last-child',
  };

  const seenKeys = new Set();
  let activeRules = [];
  const pendingItems = new Map();
  let flushTimeout = null;

  // ---------- Category Detection ----------
  const CATEGORY_KEYWORDS = {
    'Technology': ['tech', 'coding', 'programming', 'javascript', 'python', 'react', 'ai', 'machine learning', 'computer', 'software', 'developer', 'web dev', 'api', 'database', 'linux', 'github', 'typescript', 'rust', 'golang'],
    'Science': ['science', 'physics', 'chemistry', 'biology', 'space', 'nasa', 'quantum', 'experiment', 'research', 'molecule', 'atom', 'evolution', 'neuroscience'],
    'Gaming': ['game', 'gaming', 'gameplay', 'playthrough', 'walkthrough', 'minecraft', 'fortnite', 'steam', 'xbox', 'playstation', 'nintendo', 'esports'],
    'Music': ['music', 'song', 'album', 'concert', 'lyrics', 'guitar', 'piano', 'beat', 'remix', 'cover', 'official video', 'audio'],
    'Education': ['tutorial', 'learn', 'course', 'lesson', 'explained', 'how to', 'guide', 'class', 'study', 'education', 'university', 'math'],
    'Entertainment': ['funny', 'comedy', 'meme', 'prank', 'challenge', 'vlog', 'reaction', 'review', 'movie', 'film', 'trailer'],
    'News': ['news', 'breaking', 'report', 'update', 'politics', 'election', 'government', 'president', 'world', 'headline'],
    'Sports': ['sport', 'football', 'soccer', 'basketball', 'nba', 'nfl', 'highlights', 'goal', 'match', 'game day', 'athlete'],
    'Film': ['movie', 'film', 'cinema', 'director', 'actor', 'oscars', 'trailer', 'scene', 'behind the scenes', 'analysis'],
    'Cooking': ['recipe', 'cook', 'food', 'kitchen', 'chef', 'restaurant', 'meal', 'baking', 'ingredient'],
    'Fitness': ['workout', 'exercise', 'gym', 'fitness', 'muscle', 'training', 'yoga', 'health', 'diet', 'nutrition'],
    'Finance': ['money', 'invest', 'stock', 'crypto', 'bitcoin', 'finance', 'economy', 'trading', 'business', 'startup'],
  };

  function detectCategory(title, channel) {
    const text = (title + ' ' + channel).toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) {
        return category;
      }
    }
    return 'Other';
  }

  // ---------- Rules ----------
  async function loadRules() {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'GET_BLOCK_RULES' });
      if (res?.ok) activeRules = res.rules || [];
    } catch (err) {
      console.warn('[RT] failed to load rules:', err);
    }
  }

  // ---------- Rich Extraction ----------
  function extractContent(element, source) {
    const link = element.querySelector(SELECTORS.link);
    const titleEl = element.querySelector(SELECTORS.title);
    const channelEl = element.querySelector(SELECTORS.channel);
    if (!link || !titleEl) return null;

    let videoId = null;
    try {
      videoId = new URL(link.href, location.origin).searchParams.get('v');
    } catch (_) {}
    if (!videoId) return null;

    const title = (titleEl.textContent || '').trim() || 'Unknown';
    const channel = (channelEl?.textContent || '').trim() || 'Unknown';

    // Extract thumbnail
    let thumbnail = '';
    const thumbEl = element.querySelector(SELECTORS.thumbnail);
    if (thumbEl) {
      thumbnail = thumbEl.src || thumbEl.getAttribute('data-thumb') || '';
    }
    // Fallback to YouTube thumbnail URL
    if (!thumbnail) {
      thumbnail = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    }

    // Extract duration
    let duration = 0;
    let durationText = '';
    const durationEl = element.querySelector(SELECTORS.duration);
    if (durationEl) {
      durationText = (durationEl.textContent || '').trim();
      duration = parseDuration(durationText);
    }
    // Also check aria-label
    if (!durationText && durationEl) {
      const ariaLabel = durationEl.getAttribute('aria-label') || '';
      durationText = ariaLabel.replace('Duration:', '').trim();
      duration = parseDuration(durationText);
    }

    // Extract views and time ago from metadata
    let views = '';
    let timeAgo = '';
    const metadataEl = element.querySelector(SELECTORS.metadata);
    if (metadataEl) {
      const spans = metadataEl.querySelectorAll('span');
      const texts = Array.from(spans).map(s => s.textContent.trim()).filter(t => t);
      // Usually: "X views • Y ago" or "X views"
      for (const text of texts) {
        if (text.includes('view') || text.includes('watching')) {
          views = text;
        } else if (text.includes('ago') || text.includes('streamed') || text.match(/^\d/)) {
          if (!views) views = text;
          else timeAgo = text;
        }
      }
    }

    // Detect category
    const category = detectCategory(title, channel);

    // Check for badges (Live, New, etc.)
    let badges = [];
    const badgeEls = element.querySelectorAll(SELECTORS.badge);
    badgeEls.forEach(b => {
      const text = b.textContent.trim();
      if (text) badges.push(text);
    });

    return {
      videoId,
      video_id: videoId,
      title,
      channel,
      category,
      thumbnail,
      duration,
      durationText,
      views,
      timeAgo,
      badges,
      source,
      timestamp: Date.now(),
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  function parseDuration(text) {
    if (!text) return 0;
    const parts = text.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return 0;
  }

  // ---------- Blocking ----------
  function applyBlockRules(elements) {
    for (const el of elements) {
      if (activeRules.length === 0) {
        el.style.display = '';
        el.style.opacity = '';
        continue;
      }
      const title = (el.querySelector(SELECTORS.title)?.textContent || '').toLowerCase();
      const channel = (el.querySelector(SELECTORS.channel)?.textContent || '').toLowerCase();
      const shouldHide = activeRules.some((rule) => {
        const target = (rule.value || '').toLowerCase();
        if (!target) return false;
        if (rule.type === 'keyword') return title.includes(target);
        if (rule.type === 'channel') return channel.includes(target);
        if (rule.type === 'category') {
          const cat = detectCategory(title, channel);
          return cat.toLowerCase() === target;
        }
        return false;
      });
      el.style.display = shouldHide ? 'none' : '';
    }
  }

  // ---------- Batching ----------
  function queueItem(element, source) {
    if (element.dataset.rtProcessed === '1') return;
    element.dataset.rtProcessed = '1';
    pendingItems.set(element, source);
    if (!flushTimeout) flushTimeout = setTimeout(flush, 500);
  }

  async function flush() {
    flushTimeout = null;
    const entries = Array.from(pendingItems.entries());
    pendingItems.clear();
    if (entries.length === 0) return;

    const records = [];
    const allElements = [];
    for (const [element, source] of entries) {
      allElements.push(element);
      const record = extractContent(element, source);
      if (!record) continue;
      const key = record.videoId + ':' + source;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      records.push(record);
    }

    applyBlockRules(allElements);

    if (records.length > 0) {
      try {
        await chrome.runtime.sendMessage({ type: 'TRACK_CONTENT', payload: records });
        console.log('[RT] tracked', records.length, 'video(s) with rich data');
      } catch (err) {
        console.warn('[RT] failed to send tracked content:', err);
      }
    }
  }

  // ---------- DOM observation ----------
  function processNodes(nodes) {
    for (const node of nodes) {
      if (!(node instanceof Element)) continue;
      if (node.matches(SELECTORS.gridItem)) queueItem(node, 'home');
      if (node.matches(SELECTORS.sidebarItem)) queueItem(node, 'sidebar');
      if (node.matches(SELECTORS.searchItem)) queueItem(node, 'search');
      node.querySelectorAll(SELECTORS.gridItem).forEach((el) => queueItem(el, 'home'));
      node.querySelectorAll(SELECTORS.sidebarItem).forEach((el) => queueItem(el, 'sidebar'));
      node.querySelectorAll(SELECTORS.searchItem).forEach((el) => queueItem(el, 'search'));
    }
  }

  function start() {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes.length) processNodes(m.addedNodes);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    processNodes([document.body]);

    window.addEventListener('yt-navigate-finish', () => {
      document.querySelectorAll('[data-rt-processed]').forEach((el) => {
        delete el.dataset.rtProcessed;
      });
      processNodes([document.body]);
    });

    console.log('[RT] enhanced content script ready — extracting thumbnails, duration, views, categories');
  }

  // ---------- Live rule updates ----------
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'RULES_UPDATED') {
      activeRules = message.rules || [];
      const all = document.querySelectorAll(
        `${SELECTORS.gridItem}, ${SELECTORS.sidebarItem}, ${SELECTORS.searchItem}`
      );
      applyBlockRules(all);
      sendResponse({ ok: true });
    }
    return true;
  });

  // ---------- Zero-Ad Guard Engine ----------
  function initAdBlocker() {
    // Inject CSS to instantly suppress ad banners & sponsor overlays
    const style = document.createElement('style');
    style.textContent = `
      ytd-ad-slot-renderer,
      ytd-banner-promo-renderer,
      ytd-statement-banner-renderer,
      ytd-in-feed-ad-layout-renderer,
      #masthead-ad,
      .ytp-ad-overlay-container,
      .ytp-ad-message-container,
      .ytd-player-legacy-desktop-watch-ads-renderer,
      #player-ads {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);

    // Fast loop to auto-skip video pre-roll / mid-roll ads in 100ms
    setInterval(() => {
      const skipButtons = document.querySelectorAll(
        '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-container button, [id*="skip-button"] button, .ytp-ad-overlay-close-button'
      );
      skipButtons.forEach((btn) => {
        try {
          btn.click();
        } catch (_) {}
      });

      // If ad is currently showing, speed it up and mute
      const adPlayer = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay');
      if (adPlayer) {
        const video = document.querySelector('video');
        if (video) {
          video.muted = true;
          video.playbackRate = 16.0;
          if (video.duration && !isNaN(video.duration)) {
            video.currentTime = video.duration - 0.05;
          }
        }
      }
    }, 100);
  }

  // ---------- Init ----------
  (async () => {
    initAdBlocker();
    await loadRules();
    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
  })();
})();
