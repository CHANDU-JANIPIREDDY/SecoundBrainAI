import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Generate summary and tags from content in a single LLM call
 * Returns structured JSON: { summary: string, tags: string[] }
 */
export const generateSummaryAndTags = async (content) => {
  try {
    const systemPrompt = `You are an expert content analyzer. Your task is to analyze content and extract:
1. A concise summary (3-4 lines, clear and informative)
2. 3-5 relevant tags (short keywords, lowercase, single words or 2-word phrases)

You MUST respond with valid JSON only, no additional text.
Format: {"summary": "your summary here", "tags": ["tag1", "tag2", "tag3"]}

Rules:
- Summary should capture the main idea clearly
- Tags should be specific, relevant keywords
- No markdown, no code blocks, just raw JSON
- Ensure JSON is properly escaped`;

    const userPrompt = `Analyze this content and extract summary + tags:

${content}`;

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent JSON output
      max_tokens: 300, // Limit tokens for efficiency
    });

    const rawResponse = completion.choices[0].message.content.trim();

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : rawResponse;

    try {
      const parsed = JSON.parse(jsonString);

      // Validate structure
      if (!parsed.summary || !Array.isArray(parsed.tags)) {
        throw new Error("Invalid response structure");
      }

      // Clean and limit tags
      const cleanedTags = parsed.tags
        .map((tag) => tag.toLowerCase().trim().replace(/[^\w\s-]/g, ""))
        .filter((tag) => tag.length > 0 && tag.length < 30)
        .slice(0, 5);

      return {
        summary: parsed.summary.trim(),
        tags: cleanedTags,
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      // Fallback: generate summary only
      return {
        summary: rawResponse,
        tags: [],
      };
    }
  } catch (error) {
    console.error("OPENROUTER ERROR:", error.message);
    throw new Error("Failed to generate summary and tags");
  }
};

export const generateAnswer = async (question, notesText) => {
  try {
    const prompt = `
You are a professional AI assistant.

Based only on the following notes:

${notesText}

Answer this question: ${question}

IMPORTANT FORMATTING RULES:
- Do not use markdown symbols
- Do not use asterisks or bold text
- Do not use headings like ###
- Do not use bullet points with dashes or stars
- Do not use any special formatting symbols
- Write in clean, readable paragraph format
- Use simple numbering only if needed (1. 2. 3.)
- Keep it visually clean and easy to understand
- Provide a clear, professional explanation
`;

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: `You are a professional AI assistant. Provide clear, well-structured answers. Do not use markdown symbols, asterisks, or headings. Write in clean readable paragraph format. Keep it visually clean and easy to understand.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    // Clean up the response: remove extra spaces and normalize line breaks
    const cleanedAnswer = answer
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/^\s*-\s*/gm, "")
      .replace(/^\s*\*\s*/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return cleanedAnswer;
  } catch (error) {
    console.error("OPENROUTER ERROR:", error.message);
    throw new Error("Failed to generate answer");
  }
};
