/**
 * Test script for AI Summary + Tags generation
 * Run: node scripts/testSummaryAndTags.js
 */

import dotenv from "dotenv";
import { generateSummaryAndTags } from "../services/aiService.js";

dotenv.config();

const testContent = `
Machine learning is a subset of artificial intelligence that enables systems to learn and improve 
from experience without being explicitly programmed. It focuses on developing computer programs 
that can access data and use it to learn for themselves. The primary aim is to allow computers 
to learn automatically without human intervention or assistance. Deep learning is a further 
subset of machine learning that uses neural networks with multiple layers to progressively 
extract higher-level features from raw input.
`;

const runTest = async () => {
  console.log("🧪 Testing AI Summary + Tags Generation\n");
  console.log("Input Content:");
  console.log("─".repeat(50));
  console.log(testContent.trim());
  console.log("─".repeat(50));
  console.log();

  try {
    const result = await generateSummaryAndTags(testContent);

    console.log("✅ Success! AI Response:\n");
    console.log("📝 Summary:");
    console.log(result.summary);
    console.log();
    console.log("🏷️  Tags:");
    result.tags.forEach((tag, i) => {
      console.log(`   ${i + 1}. ${tag}`);
    });
    console.log();
    console.log("Raw JSON:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

runTest();
