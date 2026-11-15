import urllib.request
import urllib.error
import json
from concurrent.futures import ThreadPoolExecutor
from test_verify_real_videos import REAL_DEVELOPER_VIDEOS

def check_video(item):
    vid, title, chan, dom, cat, sub_id = item
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=3) as res:
            if res.status == 200:
                data = json.loads(res.read().decode('utf-8'))
                return (True, vid, data.get("title", title), chan, dom, cat, sub_id, None)
    except urllib.error.HTTPError as e:
        return (False, vid, title, chan, dom, cat, sub_id, f"HTTP {e.code}")
    except Exception as e:
        return (False, vid, title, chan, dom, cat, sub_id, str(e))

if __name__ == "__main__":
    print(f"Starting verification of {len(REAL_DEVELOPER_VIDEOS)} videos...", flush=True)
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(check_video, REAL_DEVELOPER_VIDEOS))

    valid = [r for r in results if r[0]]
    invalid = [r for r in results if not r[0]]

    print(f"\nVERIFICATION RESULTS:", flush=True)
    print(f"VALID: {len(valid)} / {len(REAL_DEVELOPER_VIDEOS)}", flush=True)
    print(f"INVALID: {len(invalid)}", flush=True)

    for r in invalid:
        print(f"  FAIL: {r[1]} ({r[3]} - {r[2]}): {r[7]}", flush=True)

    # Save valid videos to verified_catalog.json
    valid_data = [
        {
            "videoId": r[1],
            "title": r[2],
            "channel": r[3],
            "domain": r[4],
            "category": r[5],
            "subcategoryId": r[6],
        }
        for r in valid
    ]
    with open("scripts/verified_catalog.json", "w", encoding="utf-8") as f:
        json.dump(valid_data, f, indent=2)
    print("Saved verified videos to scripts/verified_catalog.json", flush=True)
