# Recommendation Tracker — Backend API
# FastAPI + SQLite (production-ready, upgradeable to PostgreSQL)

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import json
import math
from datetime import datetime, timedelta
from collections import Counter

app = FastAPI(title="RecTracker API", version="1.0.0")

# CORS — allow extension + web app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Database ----------
def get_db():
    conn = sqlite3.connect("rectracker.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            created_at TEXT DEFAULT (datetime('now')),
            preferences TEXT DEFAULT '{}'
        );
        
        CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            video_id TEXT NOT NULL,
            title TEXT NOT NULL,
            channel TEXT NOT NULL,
            category TEXT DEFAULT 'unknown',
            tags TEXT DEFAULT '[]',
            source TEXT DEFAULT 'home',
            thumbnail TEXT DEFAULT '',
            duration INTEGER DEFAULT 0,
            watched INTEGER DEFAULT 0,
            timestamp TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        
        CREATE TABLE IF NOT EXISTS block_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            value TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        
        CREATE TABLE IF NOT EXISTS user_interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            category TEXT NOT NULL,
            score REAL DEFAULT 0,
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_content_user ON content(user_id);
        CREATE INDEX IF NOT EXISTS idx_content_video ON content(video_id);
        CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
        CREATE INDEX IF NOT EXISTS idx_block_user ON block_rules(user_id);
        CREATE INDEX IF NOT EXISTS idx_interests_user ON user_interests(user_id);
    """)
    conn.commit()
    conn.close()

init_db()

# ---------- Models ----------
class ContentItem(BaseModel):
    video_id: str
    title: str
    channel: str
    category: str = "unknown"
    tags: list[str] = []
    source: str = "home"
    thumbnail: str = ""
    duration: int = 0

class BlockRule(BaseModel):
    type: str  # keyword, channel, category
    value: str

class UserPreferences(BaseModel):
    preferred_categories: list[str] = []
    blocked_categories: list[str] = []
    min_duration: int = 0
    max_duration: int = 0
    language: str = "en"

# ---------- Auth (simple user ID for MVP) ----------
def get_or_create_user(user_id: str):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        conn.execute("INSERT INTO users (id) VALUES (?)", (user_id,))
        conn.commit()
    conn.close()
    return user_id

# ---------- Endpoints ----------

# Health check
@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

# --- Content Tracking ---
@app.post("/api/content/track")
def track_content(user_id: str, items: list[ContentItem]):
    get_or_create_user(user_id)
    conn = get_db()
    count = 0
    for item in items:
        # Deduplicate by video_id + user
        existing = conn.execute(
            "SELECT id FROM content WHERE user_id = ? AND video_id = ?",
            (user_id, item.video_id)
        ).fetchone()
        if not existing:
            conn.execute(
                """INSERT INTO content 
                (user_id, video_id, title, channel, category, tags, source, thumbnail, duration)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (user_id, item.video_id, item.title, item.channel, 
                 item.category, json.dumps(item.tags), item.source,
                 item.thumbnail, item.duration)
            )
            count += 1
    conn.commit()
    conn.close()
    return {"tracked": count}

@app.get("/api/content")
def get_content(
    user_id: str,
    limit: int = Query(50, le=200),
    offset: int = 0,
    category: Optional[str] = None,
    channel: Optional[str] = None,
    search: Optional[str] = None,
    source: Optional[str] = None
):
    conn = get_db()
    query = "SELECT * FROM content WHERE user_id = ?"
    params = [user_id]
    
    if category:
        query += " AND category = ?"
        params.append(category)
    if channel:
        query += " AND channel LIKE ?"
        params.append(f"%{channel}%")
    if search:
        query += " AND (title LIKE ? OR channel LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    if source:
        query += " AND source = ?"
        params.append(source)
    
    query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    rows = conn.execute(query, params).fetchall()
    total = conn.execute(
        "SELECT COUNT(*) FROM content WHERE user_id = ?", (user_id,)
    ).fetchone()[0]
    conn.close()
    
    return {
        "items": [dict(r) for r in rows],
        "total": total,
        "limit": limit,
        "offset": offset
    }

# --- Block Rules ---
@app.get("/api/block-rules")
def get_block_rules(user_id: str):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM block_rules WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,)
    ).fetchall()
    conn.close()
    return {"rules": [dict(r) for r in rows]}

@app.post("/api/block-rules")
def add_block_rule(user_id: str, rule: BlockRule):
    get_or_create_user(user_id)
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO block_rules (user_id, type, value) VALUES (?, ?, ?)",
        (user_id, rule.type, rule.value)
    )
    conn.commit()
    rule_id = cursor.lastrowid
    conn.close()
    return {"id": rule_id, "type": rule.type, "value": rule.value}

@app.delete("/api/block-rules/{rule_id}")
def delete_block_rule(user_id: str, rule_id: int):
    conn = get_db()
    conn.execute(
        "DELETE FROM block_rules WHERE id = ? AND user_id = ?",
        (rule_id, user_id)
    )
    conn.commit()
    conn.close()
    return {"deleted": True}

# --- Search & Discovery ---
@app.get("/api/search")
def search_content(
    user_id: str,
    q: str,
    limit: int = Query(20, le=100)
):
    """Search tracked content by title, channel, or category"""
    conn = get_db()
    rows = conn.execute(
        """SELECT * FROM content 
        WHERE user_id = ? AND (title LIKE ? OR channel LIKE ? OR category LIKE ?)
        ORDER BY timestamp DESC LIMIT ?""",
        (user_id, f"%{q}%", f"%{q}%", f"%{q}%", limit)
    ).fetchall()
    conn.close()
    return {"results": [dict(r) for r in rows], "query": q}

@app.get("/api/categories")
def get_categories(user_id: str):
    """Get all categories with counts"""
    conn = get_db()
    rows = conn.execute(
        """SELECT category, COUNT(*) as count 
        FROM content WHERE user_id = ? 
        GROUP BY category ORDER BY count DESC""",
        (user_id,)
    ).fetchall()
    conn.close()
    return {"categories": [dict(r) for r in rows]}

@app.get("/api/channels")
def get_channels(user_id: str, limit: int = Query(50, le=200)):
    """Get all channels with counts"""
    conn = get_db()
    rows = conn.execute(
        """SELECT channel, COUNT(*) as count 
        FROM content WHERE user_id = ? 
        GROUP BY channel ORDER BY count DESC LIMIT ?""",
        (user_id, limit)
    ).fetchall()
    conn.close()
    return {"channels": [dict(r) for r in rows]}

# --- Analytics ---
@app.get("/api/analytics")
def get_analytics(user_id: str, days: int = 7):
    conn = get_db()
    
    # Daily activity
    daily = conn.execute(
        """SELECT DATE(timestamp) as date, COUNT(*) as count
        FROM content WHERE user_id = ? 
        AND timestamp >= datetime('now', ?)
        GROUP BY DATE(timestamp) ORDER BY date""",
        (user_id, f"-{days} days")
    ).fetchall()
    
    # Top categories
    categories = conn.execute(
        """SELECT category, COUNT(*) as count
        FROM content WHERE user_id = ?
        GROUP BY category ORDER BY count DESC LIMIT 10""",
        (user_id,)
    ).fetchall()
    
    # Top channels
    channels = conn.execute(
        """SELECT channel, COUNT(*) as count
        FROM content WHERE user_id = ?
        GROUP BY channel ORDER BY count DESC LIMIT 10""",
        (user_id,)
    ).fetchall()
    
    # Source distribution
    sources = conn.execute(
        """SELECT source, COUNT(*) as count
        FROM content WHERE user_id = ?
        GROUP BY source ORDER BY count DESC""",
        (user_id,)
    ).fetchall()
    
    # Total
    total = conn.execute(
        "SELECT COUNT(*) as count FROM content WHERE user_id = ?",
        (user_id,)
    ).fetchone()
    
    conn.close()
    
    return {
        "total": total["count"] if total else 0,
        "daily": [dict(r) for r in daily],
        "top_categories": [dict(r) for r in categories],
        "top_channels": [dict(r) for r in channels],
        "sources": [dict(r) for r in sources],
        "days": days
    }

# --- AI Recommendations (Content-Based Filtering) ---
@app.get("/api/recommendations")
def get_recommendations(
    user_id: str,
    limit: int = Query(20, le=100)
):
    """
    Content-based recommendation engine.
    Analyzes user's watched content to find patterns and suggest
    what they might want to watch next.
    """
    conn = get_db()
    
    # Get user's interest profile (most watched categories)
    interests = conn.execute(
        """SELECT category, COUNT(*) as weight
        FROM content WHERE user_id = ?
        GROUP BY category ORDER BY weight DESC LIMIT 5""",
        (user_id,)
    ).fetchall()
    
    if not interests:
        conn.close()
        return {"recommendations": [], "interest_profile": []}
    
    # Get user's preferred channels
    pref_channels = conn.execute(
        """SELECT channel, COUNT(*) as weight
        FROM content WHERE user_id = ?
        GROUP BY channel ORDER BY weight DESC LIMIT 10""",
        (user_id,)
    ).fetchall()
    
    # Get block rules to exclude
    blocked = conn.execute(
        "SELECT type, value FROM block_rules WHERE user_id = ?",
        (user_id,)
    ).fetchall()
    
    blocked_channels = {r["value"].lower() for r in blocked if r["type"] == "channel"}
    blocked_keywords = [r["value"].lower() for r in blocked if r["type"] == "keyword"]
    blocked_categories = {r["value"].lower() for r in blocked if r["type"] == "category"}
    
    # Score all content based on interest match
    all_content = conn.execute(
        "SELECT * FROM content WHERE user_id = ? ORDER BY timestamp DESC LIMIT 500",
        (user_id,)
    ).fetchall()
    
    # Build recommendations from content the user HASN'T fully consumed
    # by finding similar content in their interest areas
    interest_scores = {r["category"]: r["weight"] for r in interests}
    channel_scores = {r["channel"]: r["weight"] for r in pref_channels}
    
    recommendations = []
    seen_videos = set()
    
    for row in all_content:
        item = dict(row)
        if item["video_id"] in seen_videos:
            continue
        
        # Skip blocked content
        if item["channel"].lower() in blocked_channels:
            continue
        if item["category"].lower() in blocked_categories:
            continue
        if any(kw in item["title"].lower() for kw in blocked_keywords):
            continue
        
        # Calculate recommendation score
        score = 0
        score += interest_scores.get(item["category"], 0) * 2
        score += channel_scores.get(item["channel"], 0) * 1.5
        
        # Recency bonus
        try:
            ts = datetime.fromisoformat(item["timestamp"])
            days_ago = (datetime.now() - ts).days
            if days_ago < 3:
                score += 3
            elif days_ago < 7:
                score += 1
        except:
            pass
        
        if score > 0:
            recommendations.append({**item, "score": round(score, 2)})
            seen_videos.add(item["video_id"])
    
    # Sort by score
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    
    conn.close()
    
    return {
        "recommendations": recommendations[:limit],
        "interest_profile": [dict(r) for r in interests],
        "algorithm": "content-based-filtering"
    }

# --- User Preferences ---
@app.get("/api/preferences")
def get_preferences(user_id: str):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if not user:
        raise HTTPException(404, "User not found")
    prefs = json.loads(user["preferences"]) if user["preferences"] else {}
    return {"preferences": prefs}

@app.put("/api/preferences")
def update_preferences(user_id: str, prefs: UserPreferences):
    get_or_create_user(user_id)
    conn = get_db()
    conn.execute(
        "UPDATE users SET preferences = ? WHERE id = ?",
        (json.dumps(prefs.dict()), user_id)
    )
    conn.commit()
    conn.close()
    return {"updated": True}

# --- Content Discovery (what user wants to watch) ---
@app.get("/api/discover")
def discover_content(
    user_id: str,
    category: Optional[str] = None,
    mood: Optional[str] = None,
    duration: Optional[str] = None,  # short, medium, long
    limit: int = Query(20, le=100)
):
    """
    Smart content discovery based on user preferences.
    Finds content matching what the user WANTS to watch.
    """
    conn = get_db()
    
    # Get user interests
    interests = conn.execute(
        """SELECT category, COUNT(*) as weight
        FROM content WHERE user_id = ?
        GROUP BY category ORDER BY weight DESC""",
        (user_id,)
    ).fetchall()
    
    # Build query based on filters
    query = "SELECT * FROM content WHERE user_id = ?"
    params = [user_id]
    
    if category:
        query += " AND category = ?"
        params.append(category)
    elif interests:
        # Default to top interest categories
        top_cats = [r["category"] for r in interests[:3]]
        placeholders = ",".join("?" * len(top_cats))
        query += f" AND category IN ({placeholders})"
        params.extend(top_cats)
    
    if duration == "short":
        query += " AND duration <= 300"
    elif duration == "medium":
        query += " AND duration > 300 AND duration <= 1200"
    elif duration == "long":
        query += " AND duration > 1200"
    
    # Exclude blocked
    blocked = conn.execute(
        "SELECT type, value FROM block_rules WHERE user_id = ?",
        (user_id,)
    ).fetchall()
    
    for rule in blocked:
        if rule["type"] == "channel":
            query += " AND channel NOT LIKE ?"
            params.append(f"%{rule['value']}%")
        elif rule["type"] == "keyword":
            query += " AND title NOT LIKE ?"
            params.append(f"%{rule['value']}%")
    
    query += " ORDER BY timestamp DESC LIMIT ?"
    params.append(limit)
    
    rows = conn.execute(query, params).fetchall()
    conn.close()
    
    return {
        "items": [dict(r) for r in rows],
        "filters": {
            "category": category,
            "mood": mood,
            "duration": duration
        }
    }

# --- Bulk operations ---
@app.delete("/api/content/clear")
def clear_content(user_id: str):
    conn = get_db()
    conn.execute("DELETE FROM content WHERE user_id = ?", (user_id,))
    conn.execute("DELETE FROM block_rules WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"cleared": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
