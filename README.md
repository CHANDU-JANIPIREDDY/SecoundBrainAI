# Second Brain AI

A full-stack AI-powered knowledge management application built with the MERN stack. Capture notes, get automatic AI-generated summaries and tags, and query your personal knowledge base using natural language.

## Live Deployment

| Component | URL |
|-----------|-----|
| **Frontend** | https://secound-brain-ai.vercel.app |
| **Backend API** | https://secoundbrainai.onrender.com |

---

## Features

### Core Functionality

- **Create Notes** - Write notes with title, content, type (note/link/insight), and tags
- **AI Summary Generation** - Automatic 3-4 line summaries generated on note creation
- **AI Auto-Tagging** - Suggests 3-5 relevant tags per note, merged with user-provided tags
- **Dashboard View** - Browse all notes with search filtering by title, content, or tags
- **Ask AI** - Ask natural language questions and get answers based on your stored notes
- **Responsive Design** - Mobile-first UI with hamburger menu and touch-friendly interface
- **Page Animations** - Smooth transitions and staggered card animations using Framer Motion

### Note Types

- **Note** - Standard text notes
- **Link** - Save and organize web links
- **Insight** - Capture key insights and learnings

---

## AI Workflow

### Summary + Tags Generation (Single Call)

When a user creates a note:

```
1. User submits note with title, content, type, and optional tags
         │
         ▼
2. Backend calls generateSummaryAndTags(content)
         │
         ▼
3. OpenRouter API (Mistral 7B) analyzes content
   - Returns JSON: { summary: "...", tags: ["...", "..."] }
         │
         ▼
4. Backend merges user tags + AI tags (deduplicated, max 10)
         │
         ▼
5. Note saved to MongoDB with summary and final tags
```

**Key implementation details:**
- Single LLM call generates both summary and tags (token-efficient)
- Temperature: 0.3 for consistent JSON output
- Max tokens: 300 to prevent runaway responses
- Graceful fallback if JSON parsing fails

### Ask AI (Knowledge Base Q&A)

When a user asks a question:

```
1. User types question in Ask AI page
         │
         ▼
2. Backend fetches all notes from MongoDB
         │
         ▼
3. Combines all note titles + content into single text block
         │
         ▼
4. Sends question + context to LLM
         │
         ▼
5. LLM generates answer based on provided notes
         │
         ▼
6. Answer returned and displayed to user
```

**Current approach:**
- Loads entire note collection into context
- Works well for small datasets (<100 notes)
- Markdown cleaned from AI responses for clean display

---

## Architecture

### Backend Structure

```
┌─────────────────────────────────────────────────────────┐
│  Backend/index.js                                       │
│  - Express server + CORS configuration                  │
│  - MongoDB Atlas connection                             │
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
│  - Request handling                                     │
│  - Business logic orchestration                         │
│  - Service calls                                        │
└─────────────────────────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
┌──────────────────────┐   ┌──────────────────────┐
│  models/Knowledge.js │   │  services/aiService.js│
│  - Mongoose schema   │   │  - OpenRouter API    │
│  - Validation rules  │   │  - generateSummary   │
│  - timestamps        │   │  - generateAnswer    │
└──────────────────────┘   └──────────────────────┘
```

### Frontend Structure

```
Frontend/client/
├── src/
│   ├── App.jsx              # Router + AnimatePresence
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation + mobile drawer
│   │   ├── Footer.jsx       # Site footer
│   │   ├── SkeletonLoader.jsx
│   │   └── PageTransition.jsx
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Dashboard.jsx    # Notes list + search
│   │   ├── AddNote.jsx      # Note creation form
│   │   └── AskAI.jsx        # Q&A interface
│   └── services/
│       └── Api.js           # Axios API client
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/knowledge` | Create note (auto-generates summary + tags) |
| `GET` | `/api/knowledge` | Get all notes (newest first) |
| `POST` | `/api/knowledge/ask` | Ask AI a question |
| `GET` | `/api/knowledge/query?q=` | Public query endpoint |

### Example: Create Note

```bash
POST https://secoundbrainai.onrender.com/api/knowledge
Content-Type: application/json

{
  "title": "Machine Learning Basics",
  "content": "Machine learning is a subset of AI...",
  "type": "note",
  "tags": ["learning"]
}
```

### Example: Ask AI

```bash
POST https://secoundbrainai.onrender.com/api/knowledge/ask
Content-Type: application/json

{
  "question": "What is machine learning?"
}

# Response
{
  "answer": "Based on your notes, machine learning is..."
}
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 7.3.1 | Build tool |
| React Router | 7.13.0 | Routing |
| Framer Motion | 12.34.0 | Animations |
| Axios | 1.13.5 | HTTP client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest | Runtime |
| Express | 4.21.2 | Web framework |
| Mongoose | 8.9.5 | MongoDB ODM |
| OpenAI SDK | 6.22.0 | OpenRouter client |
| dotenv | 16.4.5 | Environment variables |
| CORS | 2.8.5 | Cross-origin requests |

### Database

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Schema:** title, content, type, tags[], summary, timestamps

### AI Provider

- **OpenRouter API** - Gateway to multiple LLM providers
- **Model:** Mistral 7B Instruct
- **Why:** Cost-effective, fast, easy model switching

---

## Environment Variables

### Backend (`.env`)

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
OPENROUTER_API_KEY=sk-or-v1-...
PORT=5000
```

### Frontend (`.env`)

```bash
VITE_API_URL=http://localhost:5000
```

### Frontend (`.env.production`)

```bash
VITE_API_URL=https://secoundbrainai.onrender.com
```

### Vercel Dashboard

Add this environment variable in Vercel project settings:

```
VITE_API_URL=https://secoundbrainai.onrender.com
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- OpenRouter API key (get from https://openrouter.ai)

### Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
echo "MONGO_URI=mongodb+srv://chandu:chandu104@cluster0.6kcjvzg.mongodb.net/?appName=Cluster0" > .env
echo "OPENROUTER_API_KEY=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" >> .env

# Start development server
npm run dev
```

Server runs on http://localhost:5000

### Frontend Setup

```bash
cd Frontend/client

# Install dependencies
npm install

# Create .env file (optional, defaults to production URL)
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

Frontend runs on http://localhost:5173

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variable: `VITE_API_URL`
4. Deploy (automatic on push)

### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory to `Backend`
4. Add environment variables: `MONGO_URI`, `OPENROUTER_API_KEY`
5. Deploy

---

## Current Limitations

### Known Issues

1. **AskAI loads all notes** - Fetches entire collection for context. Works fine for <100 notes but needs optimization (text search or vector embeddings) for larger datasets.

2. **No authentication** - Anyone can create and query notes. Suitable for demo/personal use but production needs user accounts.

3. **No rate limiting** - API has no request throttling. Could hit API limits under heavy use.

4. **No input validation** - Basic validation only. Production should add `zod` or `joi` schemas.

### Planned Improvements

- MongoDB text search for efficient note retrieval
- JWT-based user authentication
- Rate limiting with `express-rate-limit`
- Request validation with Zod
- Vector embeddings for semantic search
- Conversation history for contextual Q&A

---

## Project Structure

```
second-brain-ai/
├── Backend/
│   ├── controllers/
│   │   └── knowledgeController.js
│   ├── models/
│   │   └── Knowledge.js
│   ├── routes/
│   │   └── knowledgeRoutes.js
│   ├── services/
│   │   └── aiService.js
│   ├── scripts/
│   │   ├── README.md
│   │   ├── createTextIndex.js
│   │   └── testSummaryAndTags.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── Frontend/client/
│   ├── public/
│   │   └── assets/icons/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── docs.md
└── README.md
```

---

## License

MIT

---

## Author

**Chandu Janipireddy**

- GitHub: [@CHANDU-JANIPIREDDY](https://github.com/CHANDU-JANIPIREDDY)
- LinkedIn: [chandu-janipireddy](https://www.linkedin.com/in/chandu-janipireddy/)
- Email: cjanipireddy@gmail.com

---

*Built for full-stack internship assignment*
