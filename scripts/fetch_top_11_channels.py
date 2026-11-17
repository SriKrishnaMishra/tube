import urllib.request
import urllib.parse
import re
import json

TARGET_SEARCHES = {
    "net-ninja": {
        "name": "The Net Ninja",
        "handle": "@NetNinja",
        "query": "The Net Ninja tutorial full course",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "avatar": "https://unavatar.io/youtube/@NetNinja",
        "subscribers": "1.3M subscribers",
        "description": "Step-by-step framework tutorials on React, Node.js, TypeScript, Vue, and modern full-stack web development."
    },
    "web-dev-simplified": {
        "name": "Web Dev Simplified",
        "handle": "@WebDevSimplified",
        "query": "Web Dev Simplified JavaScript React tutorial",
        "domain": "Web Development",
        "category": "Frontend frameworks (React, Vue, Svelte)",
        "subcategoryId": 17,
        "avatar": "https://unavatar.io/youtube/@WebDevSimplified",
        "subscribers": "1.6M subscribers",
        "description": "Clear, easy-to-understand explanations for tricky JavaScript, React hooks, and frontend architecture concepts."
    },
    "kevin-powell": {
        "name": "Kevin Powell",
        "handle": "@KevinPowell",
        "query": "Kevin Powell CSS grid flexbox responsive web design",
        "domain": "Web Development",
        "category": "CSS, animations & design systems",
        "subcategoryId": 21,
        "avatar": "https://unavatar.io/youtube/@KevinPowell",
        "subscribers": "950K subscribers",
        "description": "Expert-level CSS, responsive layouts, modern Flexbox, Grid, and design systems tutorials."
    },
    "theo-t3": {
        "name": "Theo - t3․gg",
        "handle": "@t3dotgg",
        "query": "Theo t3gg TypeScript Next.js React 19 architecture",
        "domain": "Web Development",
        "category": "Full-Stack Frameworks",
        "subcategoryId": 19,
        "avatar": "https://unavatar.io/youtube/@t3dotgg",
        "subscribers": "320K subscribers",
        "description": "Modern TypeScript, Next.js, React 19 server actions, and candid full-stack web architecture insights."
    },
    "hussein-nasser": {
        "name": "Hussein Nasser",
        "handle": "@hnasr",
        "query": "Hussein Nasser backend engineering database networking protocols",
        "domain": "Databases & Storage",
        "category": "Database indexing & query optimization",
        "subcategoryId": 27,
        "avatar": "https://unavatar.io/youtube/@hnasr",
        "subscribers": "410K subscribers",
        "description": "Deep dives into backend internals, networking protocols (HTTP/3, TCP, QUIC), databases, indexing, and production infrastructure."
    },
    "theprimeagen": {
        "name": "ThePrimeagen",
        "handle": "@ThePrimeagen",
        "query": "ThePrimeagen coding performance algorithms vim",
        "domain": "Software Engineering Practice",
        "category": "Clean code & refactoring",
        "subcategoryId": 56,
        "avatar": "https://unavatar.io/youtube/@ThePrimeagen",
        "subscribers": "720K subscribers",
        "description": "Performance thinking, editor workflows, algorithms, Rust, and unapologetic software engineering opinions."
    },
    "continuous-delivery": {
        "name": "Continuous Delivery",
        "handle": "@ContinuousDelivery",
        "query": "Continuous Delivery Dave Farley CI CD testing microservices",
        "domain": "Cloud & DevOps",
        "category": "CI/CD pipelines & automation",
        "subcategoryId": 32,
        "avatar": "https://unavatar.io/youtube/@ContinuousDelivery",
        "subscribers": "290K subscribers",
        "description": "Advanced software engineering principles, automated testing, TDD, microservices, and continuous delivery discipline by Dave Farley."
    }
}

verified_channel_videos = {}

for ch_id, ch_info in TARGET_SEARCHES.items():
    print(f"Searching for {ch_info['name']}...")
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(ch_info['query'])}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }
    req = urllib.request.Request(url, headers=headers)
    found = []
    try:
        with urllib.request.urlopen(req, timeout=6) as res:
            html = res.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'\"videoId\":\"([A-Za-z0-9_-]{11})\"[^\}]+?\"title\":\{\"runs\":\[\{\"text\":\"([^\"]+)\"\}', html)
            seen = set()
            for vid, title in matches:
                if vid not in seen and len(vid) == 11:
                    seen.add(vid)
                    found.append((vid, title.replace('\\u0026', '&').replace('\\"', '"')))
    except Exception as e:
        print(f"  Search error: {e}")

    # Verify each found video with oEmbed
    valid_vids = []
    for vid, raw_title in found[:10]:
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
        try:
            req_o = urllib.request.Request(oembed_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req_o, timeout=3) as r:
                if r.status == 200:
                    d = json.loads(r.read().decode('utf-8'))
                    valid_vids.append({
                        "videoId": vid,
                        "title": d.get("title", raw_title),
                        "author": d.get("author_name", ch_info["name"]),
                        "channelId": ch_id,
                        "domain": ch_info["domain"],
                        "category": ch_info["category"],
                        "subcategoryId": ch_info["subcategoryId"]
                    })
                    print(f"    [VERIFIED] {vid} -> {d.get('title')[:45]} ({d.get('author_name')})")
                    if len(valid_vids) >= 5:
                        break
        except Exception as e:
            pass

    verified_channel_videos[ch_id] = {
        "info": ch_info,
        "videos": valid_vids
    }

with open("scripts/new_channels_full.json", "w", encoding="utf-8") as f:
    json.dump(verified_channel_videos, f, indent=2)

print("\nDone! Saved to scripts/new_channels_full.json")
