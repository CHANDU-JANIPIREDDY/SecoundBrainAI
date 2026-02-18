# Second Brain - Technical Documentation

## Overview

Second Brain is an AI-powered knowledge management system built with the MERN stack (MongoDB, Express, React, Node.js). It helps users capture notes, automatically generates summaries and tags using AI, and answers questions by searching through stored knowledge.

The system runs on two main parts:
- **Backend API** (port 5000) - Handles data storage and AI processing
- **Frontend SPA** - A React application for user interaction

---

## Architecture

### Backend Structure

The backend uses a layered architecture that keeps code organized and maintainable:

```
┌─────────────────────────────────────────────────────────┐
│  index.js                                               │
│  - Express server setup                                 │
│  - MongoDB connection                                   │
│  - CORS configuration                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  routes/knowledgeRoutes.js                              │
│  - POST /          → createKnowledge                    │
│  - GET /           → getAllKnowledge                    │
│  - POST /ask       → askKnowledge                       │
│  - GET /query      → publicQuery                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  controllers/knowledgeController.js                     │
│  - Handles request logic                                │
│  - Calls services for AI operations                     │
│  - Returns JSON responses                               │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
┌──────────────────────┐   ┌──────────────────────┐
│  models/Knowledge.js │   │  services/aiService.js│
│  - Mongoose schema   │   │  - OpenRouter API    │
│  - Data validation   │   │  - Summary + Tags    │
│  - timestamps        │   │  - Q&A generation    │
└──────────────────────┘   └──────────────────────┘
```

### Separation of Concerns

Each layer has one job:

| Layer | Responsibility |
|-------|---------------|
| **Routes** | Maps URLs to controller functions |
| **Controllers** | Orchestrates business logic |
| **Services** | Handles external AI API calls |
| **Models** | Defines data structure and validation |

This structure means you can change the AI provider without touching routes, or change the database schema without touching controllers.

### Frontend Structure

```
src/
├── App.jsx              # Router + page transitions
├── main.jsx             # Entry point
├── index.css            # Global styles
├── components/
│   ├── Navbar.jsx       # Navigation with mobile drawer
│   ├── Footer.jsx       # Site footer
│   ├── SkeletonLoader.jsx # Loading placeholder
│   └── PageTransition.jsx # Framer Motion wrapper
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Dashboard.jsx    # Notes list with search
│   ├── AddNote.jsx      # Note creation form
│   └── AskAI.jsx        # Q&A interface
└── services/
    └── Api.js           # Axios API client
```

---

## AI Features Implemented

### 1. Automatic Summary Generation

When a user creates a note, the system automatically generates a 3-4 line summary:

**How it works:**
1. User submits note content
2. Backend calls `generateSummaryAndTags()` with the content
3. AI (Mistral 7B via OpenRouter) analyzes the text
4. Returns a concise summary
5. Summary is saved with the note in MongoDB

**Prompt used:**
```
System: "You are an expert content analyzer. Extract:
         1. A concise summary (3-4 lines)
         2. 3-5 relevant tags (short keywords)
         Respond with valid JSON only."
```

### 2. Automatic Tag Generation

Tags are generated in the same AI call as the summary (token-efficient):

**Process:**
- AI suggests 3-5 relevant keywords
- Tags are cleaned (lowercase, special characters removed)
- User-provided tags are merged with AI tags
- Duplicates are removed
- Maximum 10 tags stored per note

**Example output:**
```json
{
  "summary": "Machine learning is a subset of AI that enables...",
  "tags": ["machine learning", "artificial intelligence", "neural networks"]
}
```

### 3. Ask AI (Knowledge Base Q&A)

Users can ask natural language questions and get answers based on their stored notes.

**How it works:**
1. User types a question
2. Backend fetches all notes from database
3. Combines note titles and content into a single text block
4. Sends question + context to AI
5. AI generates an answer based on the provided notes
6. Answer is displayed to user

**Current implementation:**
```javascript
// Fetches all notes
const knowledge = await Knowledge.find();

// Combines into context string
const combinedNotesText = knowledge
  .map((k) => `Title: ${k.title}\nContent: ${k.content}`)
  .join("\n\n");

// Sends to AI
const answer = await generateAnswer(question, combinedNotesText);
```

**Note:** The current implementation loads all notes into context. For large databases, this should be optimized with text search or vector retrieval.

---

## UX & Design Decisions

### Loading States

**Skeleton Loader:**
- Shows a placeholder layout while the app loads
- Mimics the actual page structure (navbar, hero, features)
- Displays for 1.2 seconds on initial load
- Prevents layout shift and improves perceived performance

**Page-Level Loading:**
- Dashboard shows spinner while fetching notes
- AskAI shows "Thinking..." animation during AI response
- Form submissions show disabled state with loading text

### Motion & Animation

**Page Transitions:**
- All pages use Framer Motion `AnimatePresence`
- Fade in + 12px upward slide on enter
- Fade out + 12px upward slide on exit
- Duration: 350ms (smooth but fast)

**Dashboard Card Animations:**
- Cards fade in and slide up (24px) on load
- Staggered timing: 80ms delay between each card
- Creates a cascading reveal effect

**Hover Micro-Interactions:**
- Note cards scale to 1.03 (3% growth) on hover
- Cards lift up 6px
- Duration: 200ms (snappy response)
- Uses GPU-accelerated transforms

### Responsiveness

**Mobile-First CSS:**
- Breakpoints at 480px, 768px, 1024px
- Navigation becomes hamburger menu on mobile
- Drawer slides in from right side
- Grid layouts collapse to single column

**Touch-Friendly:**
- Buttons have adequate padding
- Form inputs are easy to tap
- Search bar spans full width on mobile

### Visual Design

**Glassmorphism Theme:**
- Semi-transparent backgrounds with blur
- Purple gradient accents (`#6366f1` → `#8b5cf6` → `#a855f7`)
- Dark background gradient (navy to deep purple)
- Subtle borders with low opacity

**Typography:**
- Poppins font for headings and body
- Gradient text for main titles
- Consistent font sizes across breakpoints

---

## API Structure

### Implemented Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/knowledge` | Create a new note (auto-generates summary + tags) |
| `GET` | `/api/knowledge` | Get all notes (sorted by newest first) |
| `POST` | `/api/knowledge/ask` | Ask AI a question about stored notes |
| `GET` | `/api/knowledge/query?q=` | Public query endpoint (returns answer + note count) |

### Request/Response Examples

**Create Note:**
```javascript
// POST /api/knowledge
{
  "title": "Machine Learning Basics",
  "content": "Machine learning is a subset of AI...",
  "type": "note",
  "tags": ["learning", "AI"]
}

// Response
{
  "_id": "...",
  "title": "Machine Learning Basics",
  "content": "Machine learning is a subset of AI...",
  "type": "note",
  "tags": ["learning", "AI", "machine learning", "neural networks"],
  "summary": "Machine learning is a subset of AI that enables...",
  "createdAt": "2026-02-18T...",
  "updatedAt": "2026-02-18T..."
}
```

**Ask AI:**
```javascript
// POST /api/knowledge/ask
{
  "question": "What is machine learning?"
}

// Response
{
  "answer": "Based on your notes, machine learning is..."
}
```

---

## Scalability & Design Considerations

### Token Efficiency

**Single AI Call for Summary + Tags:**
- Instead of two separate calls, both outputs come from one request
- Reduces API cost by ~50%
- Reduces latency from ~3s to ~1.5s

**Token Limits:**
- `max_tokens: 300` prevents runaway responses
- Temperature set to 0.3 for consistent output
- Tags limited to 5 from AI, 10 total after merging

### Environment Variables

Sensitive configuration is stored in `.env`:

```bash
# Backend/.env
MONGO_URI=mongodb+srv://...      # MongoDB Atlas connection
OPENROUTER_API_KEY=sk-or-...      # AI provider API key
```

**Security practices:**
- No hardcoded credentials in source code
- `.env` file excluded from Git (via `.gitignore`)
- API calls happen server-side only (keys never exposed to frontend)

### Current Limitations

**AskAI loads all notes:**
- Current implementation fetches entire collection
- Works fine for small datasets (<100 notes)
- Will need optimization for larger datasets:
  - MongoDB text search (already indexed in schema)
  - Vector embeddings for semantic search
  - Pagination or chunking

**No authentication:**
- Anyone can create and query notes
- Suitable for demo/personal use
- Production would need user accounts + JWT

**No rate limiting:**
- API has no request throttling
- Could be abused or hit API limits
- Production should add `express-rate-limit`

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 7.3.1 | Build tool + dev server |
| React Router | 7.13.0 | Client-side routing |
| Framer Motion | 12.34.0 | Animations |
| Axios | 1.13.5 | HTTP client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | Runtime |
| Express | 4.21.2 | Web framework |
| ES Modules | Native | Import/export syntax |
| dotenv | 16.4.5 | Environment variables |
| CORS | 2.8.5 | Cross-origin requests |

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| MongoDB | Atlas | Cloud NoSQL database |
| Mongoose | 8.9.5 | ODM + schema validation |

**Schema:**
```javascript
{
  title: String (required),
  content: String (required),
  type: Enum ["note", "link", "insight"],
  tags: [String],
  summary: String (AI-generated),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### AI Provider

| Technology | Purpose |
|------------|---------|
| OpenRouter API | Gateway to multiple LLM providers |
| Mistral 7B Instruct | Primary model (fast, cost-effective) |
| OpenAI SDK | Client library (OpenRouter compatible) |

**Why OpenRouter:**
- Single API for multiple models
- Lower cost than direct OpenAI
- Easy to switch models without code changes
- Same SDK interface as OpenAI

---

## Deployment

### Current Setup

**Frontend:**
- Built with Vite (`npm run build`)
- Outputs static files to `dist/` folder
- Can be deployed to Vercel, Netlify, or any static host

**Backend:**
- Node.js server (`npm start`)
- Runs on port 5000 (configurable via `.env`)
- Can be deployed to Railway, Render, or Heroku

**Database:**
- MongoDB Atlas (cloud-hosted)
- Already configured for production use
- Connection string stored in `.env`

### Running Locally

```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend (in separate terminal)
cd Frontend/client
npm install
npm run dev
```

---

## Summary

Second Brain is a functional knowledge management system with:

✅ **Core Features Working:**
- Create notes with AI-generated summaries
- Automatic tag suggestions
- Ask questions about stored knowledge
- Responsive, animated UI

✅ **Clean Architecture:**
- Layered backend structure
- Separation of concerns
- Environment-based configuration

✅ **Production Foundation:**
- MongoDB Atlas (cloud database)
- AI integration via OpenRouter
- Modern React with animations

