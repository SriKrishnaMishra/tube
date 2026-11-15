// Recommendation Tracker — Background Service Worker (API-Connected Version)
// Syncs with FastAPI backend for cross-device support

const API_BASE = 'http://localhost:8000/api';
const USER_ID = 'user_' + (Math.random().toString(36).substr(2, 9));

// ---------- Local Cache (for offline support) ----------
let localCache = {
  rules: [],
  lastSync: 0,
};

// ---------- API Communication ----------
async function apiCall(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);
    
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[RT] API call failed:', err.message);
    return null;
  }
}

// ---------- Content Tracking ----------
async function trackContent(items) {
  const result = await apiCall(`/content/track?user_id=${USER_ID}`, 'POST', items);
  if (result) {
    console.log(`[RT] Synced ${result.tracked} items to API`);
  }
  return result;
}

// ---------- Block Rules ----------
async function fetchBlockRules() {
  const result = await apiCall(`/block-rules?user_id=${USER_ID}`);
  if (result) {
    localCache.rules = result.rules || [];
    localCache.lastSync = Date.now();
  }
  return localCache.rules;
}

async function addBlockRule(rule) {
  const result = await apiCall(`/block-rules?user_id=${USER_ID}`, 'POST', rule);
  if (result) {
    await fetchBlockRules(); // Refresh cache
  }
  return result;
}

async function deleteBlockRule(ruleId) {
  const result = await apiCall(`/block-rules/${ruleId}?user_id=${USER_ID}`, 'DELETE');
  if (result) {
    await fetchBlockRules(); // Refresh cache
  }
  return result;
}

// ---------- Recommendations ----------
async function fetchRecommendations(limit = 20) {
  return await apiCall(`/recommendations?user_id=${USER_ID}&limit=${limit}`);
}

// ---------- Analytics ----------
async function fetchAnalytics(days = 7) {
  return await apiCall(`/analytics?user_id=${USER_ID}&days=${days}`);
}

// ---------- Search ----------
async function searchContent(query, limit = 50) {
  return await apiCall(`/search?user_id=${USER_ID}&q=${encodeURIComponent(query)}&limit=${limit}`);
}

// ---------- Broadcasting ----------
async function broadcastRules(rules) {
  try {
    const tabs = await chrome.tabs.query({ url: '*://*.youtube.com/*' });
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: 'RULES_UPDATED', rules }).catch(() => {});
    }
  } catch (err) {
    console.warn('[RT] broadcast failed:', err);
  }
}

// ---------- Message Handler ----------
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case 'TRACK_CONTENT':
          await trackContent(message.payload);
          sendResponse({ ok: true });
          break;
          
        case 'GET_BLOCK_RULES': {
          const rules = await fetchBlockRules();
          sendResponse({ ok: true, rules });
          break;
        }
        
        case 'ADD_BLOCK_RULE': {
          await addBlockRule(message.payload);
          const rules = await fetchBlockRules();
          await broadcastRules(rules);
          sendResponse({ ok: true });
          break;
        }
        
        case 'DELETE_BLOCK_RULE': {
          await deleteBlockRule(message.payload.id);
          const rules = await fetchBlockRules();
          await broadcastRules(rules);
          sendResponse({ ok: true });
          break;
        }
        
        case 'GET_RECOMMENDATIONS': {
          const recs = await fetchRecommendations(message.payload?.limit || 20);
          sendResponse({ ok: true, recommendations: recs });
          break;
        }
        
        case 'GET_ANALYTICS': {
          const analytics = await fetchAnalytics(message.payload?.days || 7);
          sendResponse({ ok: true, analytics });
          break;
        }
        
        case 'SEARCH_CONTENT': {
          const results = await searchContent(message.payload.query, message.payload.limit || 50);
          sendResponse({ ok: true, results });
          break;
        }
        
        case 'GET_STATS': {
          const analytics = await fetchAnalytics(30);
          const rules = await fetchBlockRules();
          sendResponse({ 
            ok: true, 
            stats: analytics, 
            rules 
          });
          break;
        }
        
        default:
          sendResponse({ ok: false, error: 'unknown message: ' + message.type });
      }
    } catch (err) {
      console.error('[RT] background error:', err);
      sendResponse({ ok: false, error: err.message });
    }
  })();
  return true;
});

// ---------- Init ----------
(async () => {
  console.log('[RT] API-connected background service worker initialized');
  console.log('[RT] User ID:', USER_ID);
  console.log('[RT] API Base:', API_BASE);
  
  // Initial sync
  await fetchBlockRules();
})();
