// ============================================================
// RecTracker — Enhanced Background Service Worker
// Handles rich YouTube data storage and statistics
// ============================================================

const DB_NAME = 'RecTrackerDB';
const DB_VERSION = 2;
let dbPromise = null;

// ---------- IndexedDB Setup ----------
function getDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Content store (videos)
      if (!db.objectStoreNames.contains('content')) {
        const store = db.createObjectStore('content', { keyPath: 'id', autoIncrement: true });
        store.createIndex('videoId', 'videoId', { unique: false });
        store.createIndex('video_id', 'video_id', { unique: false });
        store.createIndex('channel', 'channel', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('source', 'source', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Block rules store
      if (!db.objectStoreNames.contains('blockRules')) {
        const store = db.createObjectStore('blockRules', { keyPath: 'id', autoIncrement: true });
        store.createIndex('type', 'type', { unique: false });
      }
      
      // User preferences store
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

// ---------- CRUD Operations ----------
async function addContentRecords(records) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('content', 'readwrite');
    const store = tx.objectStore('content');
    let added = 0;
    for (const record of records) {
      // Ensure video_id field exists (for API compatibility)
      if (!record.video_id && record.videoId) {
        record.video_id = record.videoId;
      }
      store.add(record);
      added++;
    }
    tx.oncomplete = () => resolve(added);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('aborted'));
  });
}

async function getAllContent() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('content', 'readonly').objectStore('content').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getBlockRules() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('blockRules', 'readonly').objectStore('blockRules').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function addBlockRule(rule) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('blockRules', 'readwrite').objectStore('blockRules').add(rule);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function deleteBlockRule(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('blockRules', 'readwrite').objectStore('blockRules').delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function clearAll() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['content', 'blockRules'], 'readwrite');
    tx.objectStore('content').clear();
    tx.objectStore('blockRules').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ---------- Statistics ----------
async function getStats() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('content', 'readonly').objectStore('content').getAll();
    req.onsuccess = () => {
      const records = req.result;
      
      // Channel counts
      const channelCounts = {};
      const categoryCounts = {};
      const sourceCounts = {};
      let totalDuration = 0;
      
      for (const r of records) {
        channelCounts[r.channel] = (channelCounts[r.channel] || 0) + 1;
        if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
        sourceCounts[r.source] = (sourceCounts[r.source] || 0) + 1;
        totalDuration += r.duration || 0;
      }
      
      // Top channels
      const topChannels = Object.entries(channelCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([channel, count]) => ({ channel, count }));
      
      // Top categories
      const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([category, count]) => ({ category, count }));
      
      // Recent videos (last 50)
      const recent = records
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 50);
      
      resolve({
        total: records.length,
        topChannels,
        topCategories,
        sourceCounts,
        totalDuration,
        recent,
      });
    };
    req.onerror = () => reject(req.error);
  });
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
          const added = await addContentRecords(message.payload);
          sendResponse({ ok: true, added });
          break;
          
        case 'GET_BLOCK_RULES': {
          const rules = await getBlockRules();
          sendResponse({ ok: true, rules });
          break;
        }
        
        case 'ADD_BLOCK_RULE': {
          await addBlockRule(message.payload);
          const rules = await getBlockRules();
          await broadcastRules(rules);
          sendResponse({ ok: true });
          break;
        }
        
        case 'DELETE_BLOCK_RULE': {
          await deleteBlockRule(message.payload.id);
          const rules = await getBlockRules();
          await broadcastRules(rules);
          sendResponse({ ok: true });
          break;
        }
        
        case 'GET_STATS': {
          const stats = await getStats();
          const rules = await getBlockRules();
          sendResponse({ ok: true, stats, rules });
          break;
        }
        
        case 'GET_ALL_CONTENT': {
          const content = await getAllContent();
          sendResponse({ ok: true, content });
          break;
        }
        
        case 'CLEAR_ALL':
          await clearAll();
          await broadcastRules([]);
          sendResponse({ ok: true });
          break;
          
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
console.log('[RT] Enhanced background service worker initialized');
console.log('[RT] Features: thumbnails, duration, views, categories, watch time');
