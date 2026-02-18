# MongoDB Text Index Setup

## Overview
This script creates a MongoDB text index on the Knowledge collection to enable efficient full-text search for the AskAI feature.

## Prerequisites
- MongoDB connection string configured in `.env`
- Node.js installed

## Setup Steps

### 1. Run the Index Creation Script

```bash
cd Backend
node scripts/createTextIndex.js
```

### 2. Verify Index Creation

The script will output:
```
✓ MongoDB connected
✓ Text index created successfully on title, content, and tags

Current indexes:
  - _id_: {"_id": 1}
  - title_text_content_text_tags_text: {"_fts": "text", "_ftsx": 1}
```

### 3. Test Text Search

You can verify the index works by running this in MongoDB Compass or shell:

```javascript
db.knowledges.find(
  { $text: { $search: "your search query" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

## How It Works

### Before (Not Scalable)
```
User asks question → Fetch ALL notes → Concatenate everything → Send to LLM
                      ❌ O(n) database load
                      ❌ O(n) token usage
                      ❌ Breaks at ~100 notes
```

### After (Scalable)
```
User asks question → Extract keywords → $text search → Top 5 relevant → Send to LLM
                      ✅ O(log n) with index
                      ✅ Fixed token budget
                      ✅ Works at any scale
```

## Index Details

**Fields Indexed:**
- `title` (text)
- `content` (text)
- `tags` (text)

**Query Pattern:**
```javascript
Knowledge.find(
  { $text: { $search: searchQuery } },
  { score: { $meta: "textScore" } }
)
  .sort({ score: { $meta: "textScore" } })
  .limit(5)
```

## Notes

- Text indexes support case-insensitive search
- Stop words are automatically ignored by MongoDB
- The index is automatically maintained on insert/update/delete
- Only one text index per collection is allowed in MongoDB

## Troubleshooting

### "Index already exists"
This is fine - the index is already created. You can skip this step.

### "MongoServerError: text index not found"
Run the setup script again, or create manually in MongoDB:
```javascript
db.knowledges.createIndex({ title: "text", content: "text", tags: "text" });
```

### Search returns no results
- Ensure notes exist in the database
- Check that the text index is created (use `db.knowledges.getIndexes()`)
- Try different search terms (stop words like "the", "is" are ignored)
