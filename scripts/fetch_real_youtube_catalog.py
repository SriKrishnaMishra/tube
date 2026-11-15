import urllib.request
import urllib.parse
import re
import json
from concurrent.futures import ThreadPoolExecutor

CHANNELS_TO_FETCH = [
    {"name": "Krish Naik", "query": "Krish Naik Machine Learning AI Agentic", "domain": "AI & Machine Learning", "category": "Machine Learning fundamentals", "subcategoryId": 1},
    {"name": "Fireship", "query": "Fireship 100 seconds code tutorial", "domain": "Cloud & DevOps", "category": "Kubernetes & containerization", "subcategoryId": 30},
    {"name": "Chai aur Code", "query": "Chai aur Code React JavaScript Python", "domain": "Web Development", "category": "Frontend frameworks (React, Vue, Svelte)", "subcategoryId": 17},
    {"name": "CodeWithHarry", "query": "CodeWithHarry Python Web Development DSA", "domain": "Programming Languages", "category": "Python", "subcategoryId": 9},
    {"name": "NeetCode", "query": "NeetCode LeetCode Algorithms System Design", "domain": "Software Engineering Practice", "category": "Interview preparation & coding challenges", "subcategoryId": 55},
    {"name": "Traversy Media", "query": "Traversy Media Crash Course React Next.js Node", "domain": "Web Development", "category": "Full-Stack Frameworks", "subcategoryId": 19},
    {"name": "freeCodeCamp.org", "query": "freeCodeCamp course full tutorial programming", "domain": "Programming Languages", "category": "Python", "subcategoryId": 9},
    {"name": "Andrej Karpathy", "query": "Andrej Karpathy Neural Networks Zero to Hero GPT", "domain": "AI & Machine Learning", "category": "Deep Learning (CNN, RNN, Transformers)", "subcategoryId": 2},
    {"name": "3Blue1Brown", "query": "3Blue1Brown Essence of linear algebra calculus neural networks", "domain": "Mathematics & Computing", "category": "Linear algebra & calculus", "subcategoryId": 47},
    {"name": "ByteByteGo", "query": "ByteByteGo System Design Architecture", "domain": "Cloud & DevOps", "category": "Distributed systems & consensus", "subcategoryId": 34},
    {"name": "StatQuest with Josh Starmer", "query": "StatQuest machine learning neural networks", "domain": "AI & Machine Learning", "category": "Machine Learning fundamentals", "subcategoryId": 1},
    {"name": "Hussein Nasser", "query": "Hussein Nasser backend engineering database", "domain": "Databases & Storage", "category": "Database indexing & query optimization", "subcategoryId": 27},
    {"name": "Piyush Garg", "query": "Piyush Garg Full Stack Docker System Design", "domain": "Web Development", "category": "Backend frameworks (Node.js, Django, Spring)", "subcategoryId": 18}
]

def search_youtube_videos(chan_info):
    query = chan_info["query"]
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    req = urllib.request.Request(url, headers=headers)
    found_videos = []
    try:
        with urllib.request.urlopen(req, timeout=6) as res:
            html = res.read().decode('utf-8', errors='ignore')
            # Extract videoId and title from ytInitialData
            matches = re.findall(r'\"videoId\":\"([A-Za-z0-9_-]{11})\"[^\}]+?\"title\":\{\"runs\":\[\{\"text\":\"([^\"]+)\"\}', html)
            seen = set()
            for vid, title in matches:
                if vid not in seen and len(vid) == 11:
                    seen.add(vid)
                    found_videos.append({
                        "videoId": vid,
                        "title": title.replace('\\u0026', '&').replace('\\"', '"'),
                        "channel": chan_info["name"],
                        "domain": chan_info["domain"],
                        "category": chan_info["category"],
                        "subcategoryId": chan_info["subcategoryId"]
                    })
    except Exception as e:
        print(f"Error scraping {chan_info['name']}: {e}", flush=True)

    return found_videos

def verify_oembed(v):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={v['videoId']}&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=3) as res:
            if res.status == 200:
                data = json.loads(res.read().decode('utf-8'))
                v["title"] = data.get("title", v["title"])
                v["author"] = data.get("author_name", v["channel"])
                return v
    except:
        return None

if __name__ == "__main__":
    print("Scraping YouTube for authentic videos...", flush=True)
    all_raw = []
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(search_youtube_videos, CHANNELS_TO_FETCH))
        for r in results:
            all_raw.extend(r)

    print(f"Discovered {len(all_raw)} candidate videos across channels.", flush=True)

    # De-duplicate
    dedup = {}
    for v in all_raw:
        if v["videoId"] not in dedup:
            dedup[v["videoId"]] = v
    unique_candidates = list(dedup.values())
    print(f"Unique candidates: {len(unique_candidates)}. Verifying with oEmbed...", flush=True)

    with ThreadPoolExecutor(max_workers=12) as executor:
        verified = [v for v in executor.map(verify_oembed, unique_candidates) if v is not None]

    print(f"100% VERIFIED PLAYABLE VIDEOS: {len(verified)}", flush=True)

    # Load existing verified from scripts/verified_catalog.json if exists
    try:
        with open("scripts/verified_catalog.json", "r", encoding="utf-8") as f:
            existing = json.load(f)
            for ev in existing:
                if ev["videoId"] not in dedup:
                    verified.append(ev)
    except:
        pass

    with open("scripts/verified_all_clean.json", "w", encoding="utf-8") as f:
        json.dump(verified, f, indent=2)

    print(f"Total verified saved: {len(verified)} in scripts/verified_all_clean.json", flush=True)
