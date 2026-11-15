# RecTracker Backend API

FastAPI backend for the Recommendation Tracker extension. Provides content tracking, smart blocking, AI recommendations, and content discovery.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The API will be available at `http://localhost:8000`

## 📖 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Health
- `GET /api/health` — Check API status

### Content Tracking
- `POST /api/content/track` — Track new content items
- `GET /api/content` — Get tracked content (with filters)
- `DELETE /api/content/clear` — Clear all content

### Search & Discovery
- `GET /api/search?q=query` — Search tracked content
- `GET /api/categories` — Get all categories with counts
- `GET /api/channels` — Get all channels with counts
- `GET /api/discover` — Smart content discovery

### Block Rules
- `GET /api/block-rules` — Get all block rules
- `POST /api/block-rules` — Add new block rule
- `DELETE /api/block-rules/{id}` — Delete block rule

### AI Recommendations
- `GET /api/recommendations` — Get personalized recommendations

### Analytics
- `GET /api/analytics` — Get viewing analytics

### User Preferences
- `GET /api/preferences` — Get user preferences
- `PUT /api/preferences` — Update user preferences

## 🧠 AI Recommendation Engine

The recommendation system uses **content-based filtering**:

1. **Interest Profiling** — Analyzes your most-watched categories
2. **Channel Preference** — Identifies your favorite channels
3. **Recency Scoring** — Boosts recent content
4. **Block Filtering** — Excludes blocked content automatically
5. **Score Calculation** — Combines all factors for final ranking

### Algorithm Weights
- Category match: 2x weight
- Channel preference: 1.5x weight
- Recency (< 3 days): +3 bonus
- Recency (< 7 days): +1 bonus

## 🗄️ Database Schema

### Tables
- `users` — User accounts and preferences
- `content` — Tracked video/content items
- `block_rules` — User's blocking rules
- `user_interests` — Computed interest scores

### Indexes
- Content by user, video_id, category
- Block rules by user
- User interests by user

## 🔧 Configuration

### Environment Variables
```bash
DATABASE_URL=sqlite:///rectracker.db  # or postgresql://...
CORS_ORIGINS=http://localhost:3000,chrome-extension://*
```

### Production Setup
```bash
# Use PostgreSQL instead of SQLite
export DATABASE_URL=postgresql://user:pass@localhost/rectracker

# Run with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📊 Example Usage

### Track Content
```bash
curl -X POST "http://localhost:8000/api/content/track?user_id=user123" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "video_id": "abc123",
      "title": "Learn Python in 10 Minutes",
      "channel": "TechChannel",
      "category": "Technology",
      "duration": 600,
      "source": "home"
    }
  ]'
```

### Get Recommendations
```bash
curl "http://localhost:8000/api/recommendations?user_id=user123&limit=10"
```

### Search Content
```bash
curl "http://localhost:8000/api/search?user_id=user123&q=python"
```

### Block a Channel
```bash
curl -X POST "http://localhost:8000/api/block-rules?user_id=user123" \
  -H "Content-Type: application/json" \
  -d '{"type": "channel", "value": "SpamChannel"}'
```

## 🔄 Extension Integration

The Chrome extension syncs with this API:

1. **Track Content** — Extension sends viewed videos to `/api/content/track`
2. **Get Rules** — Extension fetches block rules from `/api/block-rules`
3. **Apply Blocks** — Extension hides matching content on YouTube
4. **Get Recommendations** — Dashboard shows AI suggestions from `/api/recommendations`

## 🚀 Deployment

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Railway / Render / Fly.io
1. Push code to GitHub
2. Connect repo to platform
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 📈 Scaling

- **SQLite** → Good for single-user or small teams
- **PostgreSQL** → Production-ready, multi-user support
- **Redis** → Cache recommendations and analytics
- **Elasticsearch** → Full-text search for large content libraries

## 🔐 Security Notes

- Add authentication (JWT/OAuth) for production
- Rate limit API endpoints
- Validate all user inputs
- Use HTTPS in production
- Sanitize database queries (already done with parameterized queries)
