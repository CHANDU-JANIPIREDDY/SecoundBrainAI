import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";

dotenv.config();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    "https://secound-brain-ai.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/knowledge", knowledgeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
