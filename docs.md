# Second Brain AI - Technical Documentation

## Overview

Second Brain AI is a full-stack knowledge management application built with the MERN stack. It enables users to capture notes, automatically generates AI-powered summaries and tags, and answers questions by querying the stored knowledge base.

**Live Deployment:**
- Frontend: https://secound-brain-ai.vercel.app
- Backend: https://secoundbrainai.onrender.com

---

## 1. Portable Architecture

### Layered Structure

The backend follows a clear four-layer architecture:

```
┌─────────────────────────────────────────────────────────┐
│  index.js                                               │
│  - Express server setup                                 │
│  - CORS configuration                                   │
│  - MongoDB connection                                   │
│  - Route mounting                                       │
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
│  - Request/response handling                            │
│  - Business logic orchestration                         │
│  - Service layer calls                                  │
│  - Error handling                                       │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
┌──────────────────────┐   ┌──────────────────────┐
│  models/Knowledge.js │   │  services/aiService.js│
│  - Mongoose schema   │   │  - OpenRouter client │
│  - Field validation  │   │  - LLM prompts       │
│  - timestamps        │   │  - Response parsing  │
└──────────────────────┘   └──────────────────────┘
```

### Separation of Concerns

Each layer has a single, well-defined responsibility:

| Layer | Responsibility | Changes Only When |
|-------|---------------|-------------------|
| **Routes** | URL-to-function mapping | API endpoint structure changes |
| **Controllers** | Request handling + orchestration | Business logic requirements change |
| **Services** | External API integration | AI provider changes |
| **Models** | Data structure + validation | Schema requirements change |

This separation means:
- Changing the AI provider requires editing only `aiService.js`
- Modifying the database schema only touches `Knowledge.js`
- Adding new endpoints only requires changes to routes and controllers

### AI Provider Swappability

The `aiService.js` module encapsulates all AI logic:

```javascript
// Current implementation
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Model used
model: "mistralai/mistral-7b-instruct"
```

**To switch providers:**

1. Change `baseURL` to new provider's endpoint
2. Update API key environment variable
3. Optionally change model name
4. No controller or route changes needed

This abstraction makes the system portable across:
- OpenRouter (current)
- OpenAI direct
- Anthropic
- Any OpenAI-compatible API

### Frontend Independence

The React frontend communicates via REST API only:

```javascript
// Frontend/client/src/services/Api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://secoundbrainai.onrender.com";
```

The same backend could serve:
- Web SPA (current - React + Vite)
- Mobile app (React Native, Flutter)
- Desktop app (Electron)
- Third-party integrations

---

## 2. Principles-Based UX

### Implemented UX Patterns

**1. Cognitive Offload**

The system handles mental work automatically:

| User Action | System Response |
|-------------|-----------------|
| Creates note | AI extracts 3-4 line summary |
| Writes content | AI suggests 3-5 relevant tags |
| Asks question | AI finds and synthesizes answer |

Users focus on content creation; the system handles organization and retrieval.

**2. Loading States**

Multiple loading states provide clear feedback:

- **Skeleton Loader** (`SkeletonLoader.jsx`) - Shows placeholder layout on initial app load (1.2s)
- **Dashboard Spinner** - Displays while fetching notes
- **AskAI "Thinking..."** - Animated dots during AI response generation
- **Form Submit States** - Buttons show "Creating..." with disabled state

**3. Page Transitions**

All pages use Framer Motion for smooth transitions:

```javascript
// App.jsx - AnimatePresence wrapper
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* Routes with fade + slide animations */}
  </Routes>
</AnimatePresence>
```

**Dashboard Card Animations:**
- Staggered reveal (80ms delay between cards)
- Fade in + 24px slide up
- Hover effect: 3% scale + 6px lift

**4. Transparency in AI Output**

AI-generated content is clearly visible:

- Summaries appear in dedicated card section with "Summary" label
- AI-suggested tags are merged with user tags (not replaced)
- Note type badges show content classification (note/link/insight)

**5. Responsive Design**

Mobile-first implementation:

- Breakpoints at 480px, 768px, 1024px
- Navigation becomes hamburger menu on mobile
- Drawer slides from right with overlay
- Grid layouts collapse to single column
- Touch-friendly button sizes

### How AI Reduces Cognitive Load

| Task | Manual Approach | AI-Powered Approach |
|------|-----------------|---------------------|
| **Review notes** | Read full content | Scan 3-line summary |
| **Organize** | Create all tags manually | AI suggests, user refines |
| **Find information** | Remember location | Ask natural language question |
| **Synthesize** | Cross-reference manually | AI combines multiple notes |

---

## 3. Agent Thinking

### Automatic Summary Generation

When a user creates a note:

```
1. User submits: { title, content, type, tags }
         │
         ▼
2. Controller calls: generateSummaryAndTags(content)
         │
         ▼
3. AI Service sends prompt to OpenRouter:
   "You are an expert content analyzer. Extract:
    1. A concise summary (3-4 lines)
    2. 3-5 relevant tags (short keywords)
    Respond with valid JSON only."
         │
         ▼
4. Mistral 7B returns:
   {
     "summary": "...",
     "tags": ["tag1", "tag2", "tag3"]
   }
         │
         ▼
5. Backend parses JSON, validates structure
         │
         ▼
6. Summary + tags saved with note in MongoDB
```

**Prompt Engineering:**
- Temperature: 0.3 (consistent JSON output)
- Max tokens: 300 (prevents runaway responses)
- Strict JSON format enforcement
- Graceful fallback if parsing fails

### Automatic Tag Generation

Tags are generated in the same LLM call as summaries:

**Processing pipeline:**
1. AI suggests 3-5 tags
2. Tags cleaned: lowercase, special characters removed
3. Length validation: max 30 characters each
4. User-provided tags merged with AI tags
5. Duplicates removed via `Set`
6. Maximum 10 tags stored per note

```javascript
// Merging logic in knowledgeController.js
const allTags = [...new Set([...userTagsArray, ...aiTags])].slice(0, 10);
```

### Retrieval-Augmented Answering (RAG)

The AskAI feature implements a basic RAG pattern:

```
User Question
       │
       ▼
┌─────────────────────────────────────────┐
│  Fetch all notes from MongoDB           │
│  const knowledge = await Knowledge.find()│
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Build context string                   │
│  Format: "Title: ...\nContent: ..."     │
│  Joined with double newlines            │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Send to LLM with prompt:               │
│  "Based only on the following notes:    │
│   ${context}                            │
│   Answer this question: ${question}"    │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Clean response:                        │
│  - Remove markdown (**, ###, -, etc.)   │
│  - Normalize line breaks                │
│  - Return plain text                    │
└─────────────────────────────────────────┘
       │
       ▼
Answer displayed to user
```

### Current Limitations

**AskAI Context Loading:**
- Currently fetches **all notes** for every query
- Works fine for small datasets (<100 notes)
- Will degrade with larger datasets
- No pagination or chunking implemented

**No Text Search (Yet):**
- MongoDB text index defined in schema but not used in AskAI
- `askKnowledge` controller uses `Knowledge.find()` without search
- Future improvement: Use `$text` search to fetch relevant notes only

**No Authentication:**
- No user accounts
- No note ownership
- Anyone can create and query all notes

**No Rate Limiting:**
- API has no request throttling
- Could exhaust OpenRouter API quota under heavy use

---

## 4. Infrastructure Mindset

### Public API Endpoints

The backend exposes a clean REST API:

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| `POST` | `/api/knowledge` | Create note | `{ title, content, type, tags }` | Created note with summary + tags |
| `GET` | `/api/knowledge` | List all notes | None | Array of notes (newest first) |
| `POST` | `/api/knowledge/ask` | Ask AI question | `{ question }` | `{ answer }` |
| `GET` | `/api/knowledge/query` | Public query | Query param `q` | `{ answer, totalNotes }` |

**Design Principles:**
- Consistent JSON responses
- HTTP status codes match semantics (200, 400, 500)
- Descriptive error messages
- Clear field names

### Environment-Based API Configuration

**Frontend uses environment variables:**

```javascript
// Frontend/client/src/services/Api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://secoundbrainai.onrender.com";
```

**Environment files:**

```bash
# .env (local development)
VITE_API_URL=http://localhost:5000

# .env.production (production builds)
VITE_API_URL=https://secoundbrainai.onrender.com
```

**Vercel deployment:**
- Add `VITE_API_URL` in Vercel dashboard
- Value: `https://secoundbrainai.onrender.com`
- Applied to production environment

### CORS Configuration

Backend configured for cross-origin requests:

```javascript
// Backend/index.js
const corsOptions = {
  origin: [
    "https://secound-brain-ai.vercel.app",  // Production frontend
    "http://localhost:5173",                 // Local Vite dev server
    "http://localhost:3000",                 // Alternative local port
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

This allows:
- Production frontend to call production backend
- Local frontend to call local backend
- Rejects requests from unknown origins

### Deployment Structure

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │    Backend      │     │   Database      │
│   (Vercel)      │────▶│    (Render)     │────▶│   (MongoDB      │
│   Static SPA    │     │    Node.js      │     │    Atlas)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   AI Provider   │
                       │   (OpenRouter)  │
                       └─────────────────┘
```

**Frontend (Vercel):**
- Built with Vite (`npm run build`)
- Static files served via CDN
- Auto-deploys on push to main branch
- Environment variables managed in dashboard

**Backend (Render):**
- Node.js web service
- Root directory: `Backend/`
- Auto-deploys on push to main branch
- Environment variables in Render dashboard

**Database (MongoDB Atlas):**
- Cloud-hosted
- Connection string in backend `.env`
- IP whitelist configured for Render

### Token Efficiency Decisions

**Single AI Call for Summary + Tags:**

| Approach | API Calls | Approx Tokens | Cost |
|----------|-----------|---------------|------|
| Naive (2 calls) | 2 | ~500-700 | 2x |
| Current (1 call) | 1 | ~300-400 | 1x |

**Savings:** ~40-50% reduction in API cost and latency

**Token Limits:**
```javascript
// aiService.js
max_tokens: 300,  // Prevents runaway responses
temperature: 0.3, // Consistent output (more cacheable)
```

**Context Limitation in AskAI:**
- Current: All notes (unbounded)
- Recommended: Top 5-10 relevant notes only
- Would reduce token usage by ~80-90% for large datasets

---

## Summary

Second Brain AI demonstrates a functional, well-structured approach to AI-powered knowledge management:

**Architecture:**
- ✅ Clear layered structure (routes → controllers → services → models)
- ✅ Separation of concerns enables easy maintenance
- ✅ AI provider abstraction allows swapping without code changes

**UX:**
- ✅ Loading states provide clear feedback
- ✅ Page animations create polished experience
- ✅ AI reduces cognitive load (auto-summary, auto-tags, natural language Q&A)

**Agent Capabilities:**
- ✅ Automatic content analysis on creation
- ✅ Structured JSON output with validation
- ✅ Basic RAG pattern for knowledge retrieval

**Infrastructure:**
- ✅ Environment-based configuration
- ✅ Production-ready CORS setup
- ✅ Clean REST API design
- ✅ Token-efficient single-call summary + tags


