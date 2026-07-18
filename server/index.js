import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/coach", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const prompt = `
You are SHRED AI Coach, a health and fitness assistant.

Your role is to provide practical, concise and personalized guidance
based only on the user's available SHRED fitness data.

Do not diagnose medical conditions or provide medical treatment.
If a question requires medical advice, recommend consulting a qualified
healthcare professional.

USER SHRED DATA:
${JSON.stringify(context || {}, null, 2)}

USER QUESTION:
${message}

Give a clear, helpful response based on the user's data.
Keep the answer concise unless the user asks for detail.
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

    const reply = response.text;

    res.json({
      reply:
        reply ||
        "I couldn't generate a response.",
    });
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error
    );

    res.status(500).json({
      error:
        "AI Coach is temporarily unavailable.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SHRED AI server running on port ${PORT}`);
});