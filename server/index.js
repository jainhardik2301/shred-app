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

app.get("/api/food-search", async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        error: "Search query is required.",
      });
    }

    const prompt = `
You are the intelligent food search engine for SHRED,
a nutrition and fitness tracking application.

A user searched for:

"${query}"

Your job is to return the most useful and relevant food options
that a person using a calorie-tracking app would expect to see.

SEARCH BEHAVIOUR:

1. Understand the user's intent rather than simply matching keywords.

2. Return between 3 and 6 highly relevant results.

3. Put the most likely/common interpretation FIRST.

4. Avoid obscure products, irrelevant branded foods, duplicate results,
or unusual variations unless the user specifically searches for a brand.

5. Support:
- Indian foods
- International foods
- Homemade foods
- Restaurant-style foods
- Fruits and vegetables
- Packaged foods
- Beverages
- Natural-language searches

Examples:

Search: "apple"

Good results:
- Apple, raw - 100 g
- Apple, small - 1 piece
- Apple, medium - 1 piece
- Apple, large - 1 piece

Search: "paneer"

Good results:
- Paneer, regular - 100 g
- Low-fat paneer - 100 g
- Homemade paneer - 100 g
- Paneer tikka - 100 g

Search: "idli"

Good results:
- Plain idli - 1 piece
- Rava idli - 1 piece
- Mini idli - 1 piece

Search: "amul milk"

Good results should prioritize relevant Amul milk products.

NUTRITION RULES:

Provide realistic estimated nutrition values for each result.

Nutrition values MUST correspond exactly to the baseQuantity.

For foods normally measured by weight:
unit = "g"
baseQuantity = 100
step = 10

For liquids:
unit = "ml"
baseQuantity = 100
step = 50

For foods naturally counted individually:
unit = "piece"
baseQuantity = 1
step = 1

When unit is "piece", nutrition values must represent ONE typical piece.

Do not mix per-100g nutrition values with a baseQuantity of 1 piece.

All calories, protein, carbohydrates and fat must be realistic estimates.

RESPONSE FORMAT:

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not include explanations.

Return exactly:

{
  "foods": [
    {
      "name": "Food name",
      "description": "Short description or serving information",
      "unit": "g",
      "baseQuantity": 100,
      "step": 10,
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0
    }
  ]
}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });

    let text =
      response.text || "";

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed =
      JSON.parse(text);

    const foods = (
      parsed.foods || []
    )
      .slice(0, 6)
      .map((food, index) => ({
        id: `ai-${Date.now()}-${index}`,

        name:
          food.name || query,

        description:
          food.description || null,

        unit:
          ["g", "ml", "piece"].includes(
            food.unit
          )
            ? food.unit
            : "g",

        baseQuantity:
          Number(food.baseQuantity) ||
          100,

        step:
          Number(food.step) ||
          (food.unit === "piece"
            ? 1
            : 10),

        calories:
          Math.round(
            Number(food.calories) || 0
          ),

        protein:
          Number(
            Number(
              food.protein
            ).toFixed(1)
          ),

        carbs:
          Number(
            Number(
              food.carbs
            ).toFixed(1)
          ),

        fat:
          Number(
            Number(
              food.fat
            ).toFixed(1)
          ),

        source:
          "AI Estimate",
      }));

        if (foods.length === 0) {
      return res.status(404).json({
        error: "No matching foods found.",
      });
    }

    return res.json({
      foods,
      source: "AI",
    });

  } catch (error) {
    console.error(
      "Food Search Error:",
      error
    );

    return res.status(500).json({
      error:
        "Food search is temporarily unavailable.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `SHRED AI server running on port ${PORT}`
  );
});