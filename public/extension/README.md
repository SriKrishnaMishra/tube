# RecTracker - AI YouTube Tracker

Track YouTube recommendations with AI. See thumbnails, watch time, categories. Block unwanted content instantly.

## 🚀 Installation (3 Steps)

1. **Download & Extract**: Extract this folder to any location on your computer
2. **Open Chrome Extensions**: Go to `chrome://extensions/`
3. **Load Unpacked**: Enable "Developer mode" → Click "Load unpacked" → Select THIS folder

## ✨ Features

### 📊 Dashboard
- **Videos Tracked**: Total count of tracked videos
- **Watch Time**: Total duration of all tracked content
- **Channels**: Number of unique channels tracked
- **Blocked**: Active blocking rules count

### 🎬 Videos Tab
- **Thumbnail Previews**: See video thumbnails directly in the extension
- **Duration Display**: Shows video length on each thumbnail
- **Category Tags**: Auto-detected categories (Tech, Gaming, Music, etc.)
- **View Counts**: See how many views each video has
- **Search**: Filter videos by title, channel, or category
- **Source Filters**: Filter by Home, Sidebar, or Search results
- **Click to Watch**: Click any video to open it on YouTube

### 🛡️ Blocking
- **Quick Block**: One-click blocking for common unwanted content
- **Keyword Blocking**: Hide videos with specific words in titles
- **Channel Blocking**: Hide all videos from specific channels
- **Category Blocking**: Hide entire categories (Gaming, News, etc.)
- **Active Rules**: View and manage all your block rules
- **Block Impact**: See statistics about your blocking rules

### ⚙️ Settings
- **API Connection**: Status of backend API sync
- **Data Export**: Export all tracked data as JSON
- **Clear Data**: Remove all tracked videos and rules
- **Theme Toggle**: Switch between dark and light mode

## 🧠 AI Features

### Auto-Categorization
Automatically detects content categories:
- Technology, Science, Gaming, Music
- Education, Entertainment, News, Sports
- Film, Cooking, Fitness, Finance

### Smart Blocking
- Block entire categories (e.g., hide all "Gaming" content)
- Block by keywords (e.g., hide "shorts", "clickbait")
- Block specific channels
- Real-time filtering on YouTube

## 📁 File Structure

```
extension/
├── manifest.json      # Extension configuration
├── background.js      # Service worker (data storage)
├── content.js         # YouTube page injection
├── popup.html         # Extension UI
├── popup.css          # Styling
├── popup.js           # UI logic
└── README.md          # This file
```

## 🔒 Privacy

- ✅ All data stored locally in your browser
- ✅ No data sent to external servers
- ✅ Works offline
- ✅ No tracking or analytics
- ✅ Open source code

## 🛠️ Technical Details

- **Manifest V3**: Latest Chrome extension standard
- **IndexedDB**: Efficient local data storage
- **Content Scripts**: Injects into YouTube pages
- **MutationObserver**: Real-time DOM monitoring
- **Service Worker**: Background data processing

## 📊 Data Collected

For each video seen on YouTube:
- Video ID and title
- Channel name
- Thumbnail URL
- Duration
- View count
- Upload time
- Category (auto-detected)
- Source (home/sidebar/search)

## 🎯 Use Cases

1. **Track Your Feed**: See what YouTube recommends to you
2. **Analyze Patterns**: Understand your content consumption
3. **Block Unwanted Content**: Hide videos you don't want to see
4. **Discover Trends**: See which categories dominate your feed
5. **Export Data**: Backup your tracking data as JSON

## 🐛 Troubleshooting

**Extension not loading?**
- Make sure you selected the folder containing `manifest.json`
- Enable "Developer mode" in Chrome extensions

**Not tracking videos?**
- Visit youtube.com and scroll through the feed
- Check the extension icon for tracked count
- Open browser console to see logs

**Blocking not working?**
- Add block rules in the Blocking tab
- Refresh the YouTube page
- Check console for "[RT] blocked" messages

## 📝 Version

**v1.0.0** - Initial release with rich YouTube tracking

## 🔗 Links

- Dashboard: Open the web app to see full analytics
- API: Connect to backend for cross-device sync
- Export: Download your data anytime

---

**Made with ❤️ for YouTube users who want control**
