import urllib.request
import re
import json

channels = [
    ('Krish Naik', 'https://www.youtube.com/@krishnaik06'),
    ('Piyush Garg', 'https://www.youtube.com/@piyushgargdev'),
    ('Fireship', 'https://www.youtube.com/@fireship'),
    ('ByteByteGo', 'https://www.youtube.com/@bytebytego'),
    ('freeCodeCamp', 'https://www.youtube.com/@freecodecamp'),
    ('Traversy Media', 'https://www.youtube.com/@traversymedia'),
    ('Andrej Karpathy', 'https://www.youtube.com/@AndrejKarpathy')
]

results = {}
for name, url in channels:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Look for channel avatar image url: yt3.googleusercontent.com or yt3.ggpht.com
            # Usually in avatar or channelMetadataRenderer or og:image
            og_img = re.search(r'<meta property="og:image" content="([^"]+)"', html)
            if og_img:
                results[name] = og_img.group(1)
            else:
                avatars = re.findall(r'https://yt3\.(?:googleusercontent|ggpht)\.com/[a-zA-Z0-9_-]+(?:=[^\s"\'<>]+)?', html)
                results[name] = avatars[0] if avatars else 'Not found'
    except Exception as e:
        results[name] = f"Error: {e}"

print(json.dumps(results, indent=2))

