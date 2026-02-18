import Knowledge from "../models/Knowledge.js";
import { generateSummaryAndTags, generateAnswer } from "../services/aiService.js";

export const createKnowledge = async (req, res) => {
  try {
    const { title, content, type, tags: userTags } = req.body;

    // Generate both summary and AI-suggested tags in a single call
    const { summary, tags: aiTags } = await generateSummaryAndTags(content);

    // Merge user-provided tags with AI-suggested tags (avoid duplicates)
    const userTagsArray = userTags
      ? (Array.isArray(userTags) ? userTags : userTags.split(",").map(t => t.trim()))
          .filter(t => t.length > 0)
      : [];

    // Combine and deduplicate tags (user tags take precedence)
    const allTags = [...new Set([...userTagsArray, ...aiTags])].slice(0, 10);

    const knowledge = new Knowledge({
      title,
      content,
      type,
      tags: allTags,
      summary,
    });

    const savedKnowledge = await knowledge.save();
    res.json(savedKnowledge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllKnowledge = async (req, res) => {
  try {
    const knowledge = await Knowledge.find().sort({ createdAt: -1 });
    res.json(knowledge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const askKnowledge = async (req, res) => {
  try {
    const { question } = req.body;

    const knowledge = await Knowledge.find();

    const combinedNotesText = knowledge
      .map((k) => `Title: ${k.title}\nContent: ${k.content}`)
      .join("\n\n");

    const answer = await generateAnswer(question, combinedNotesText);

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const publicQuery = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const knowledge = await Knowledge.find();

    const combinedNotesText = knowledge
      .map((k) => `Title: ${k.title}\nContent: ${k.content}`)
      .join("\n\n");

    const answer = await generateAnswer(q, combinedNotesText);

    res.json({
      answer,
      totalNotes: knowledge.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
