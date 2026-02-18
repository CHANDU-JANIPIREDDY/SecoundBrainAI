import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/knowledge", knowledgeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
