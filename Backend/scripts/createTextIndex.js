/**
 * One-time script to create MongoDB text index on Knowledge collection
 * Run: node scripts/createTextIndex.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Knowledge from "../models/Knowledge.js";

dotenv.config();

const createTextIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ MongoDB connected");

    // Create the text index
    await Knowledge.collection.createIndex({
      title: "text",
      content: "text",
      tags: "text",
    });

    console.log("✓ Text index created successfully on title, content, and tags");

    // List all indexes to verify
    const indexes = await Knowledge.collection.listIndexes().toArray();
    console.log("\nCurrent indexes:");
    indexes.forEach((idx) => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    await mongoose.connection.close();
    console.log("\n✓ Connection closed");
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  }
};

createTextIndex();
