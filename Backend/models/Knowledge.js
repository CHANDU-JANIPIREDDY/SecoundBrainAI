import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["note", "link", "insight"],
    },
    tags: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Knowledge = mongoose.model("Knowledge", knowledgeSchema);

export default Knowledge;
