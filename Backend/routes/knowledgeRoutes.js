import express from "express";
import { createKnowledge, getAllKnowledge, askKnowledge, publicQuery } from "../controllers/knowledgeController.js";

const router = express.Router();

router.post("/", createKnowledge);
router.get("/", getAllKnowledge);
router.post("/ask", askKnowledge);
router.get("/query", publicQuery);

export default router;
