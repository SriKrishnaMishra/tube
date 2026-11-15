# Recommendation Tracker — Chrome Extension

An AI-powered Chrome extension that helps you track, understand, personalize, and control your YouTube recommendations.

## 🚀 Quick Install (5 steps)

1. **Download** this `extension/` folder to your computer
2. Open Chrome → go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"** button
5. Select the `extension/` folder

That's it! The extension icon will appear in your toolbar.

## 📁 Files in this folder

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration (Manifest V3) |
| `background.js` | Service worker — handles IndexedDB storage & messaging |
| `content.js` | Injects into YouTube to track & block content |
| `popup.html` | Extension popup UI structure |
| `popup.css` | Popup styling (dark/light theme) |
| `popup.js` | Popup logic — dashboard, blocking, settings |

## ✅ Testing

### Test Tracking
1. Visit `youtube.com`
2. Scroll through the home feed
3. Open the extension popup (click the icon)
4. The **Tracked Videos** counter should increase
5. **Top Channels** and **Recent Activity** should populate

### Test Blocking
1. Note a channel name in your YouTube feed
2. In the popup → **Blocking** tab
3. Select **Channel**, type the channel name, click **Add**
4. Return to YouTube — matching cards should **disappear immediately**
5. Remove the rule with **×** — cards reappear

### Test Persistence
- Close and reopen Chrome
- Open the popup — stats should persist (stored in IndexedDB)

## 🔧 Debugging

- **Content script logs**: Right-click YouTube → Inspect → Console (look for `[RT]`)
- **Background logs**: `chrome://extensions/` → your extension → click "Service Worker"
- **Popup logs**: Right-click the popup → Inspect

## 🔒 Privacy

- All data stored locally in your browser (IndexedDB)
- No passwords, cookies, or sensitive data collected
- Minimum browser permissions (only `storage` + YouTube host)
- No data sent to external servers

## 🗺️ Roadmap

- **Phase 1 (Current)**: YouTube tracking, keyword/channel blocking, local storage
- **Phase 2**: Interest analysis, AI recommendations, content-based filtering
- **Phase 3**: Spotify/Netflix support, backend sync, advanced ML
