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

app.get("/api/exercise-search", async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        error: "Search query is required.",
      });
    }

    const prompt = `
You are the intelligent exercise search engine for SHRED,
a fitness and workout tracking application.

The user searched for:

"${query}"

Your job is to return the most useful and relevant exercises
that a person building a workout plan would expect to see.

SEARCH BEHAVIOUR:

1. Understand the user's intent, not just exact keywords.

2. Return between 15 and 25 relevant exercises when the search is broad,
such as "legs", "chest", "back", "biceps", "triceps" or "shoulders".

For specific searches, return only the relevant matching exercises.

Include a comprehensive mix of common exercises, equipment variations,
machine exercises, free-weight exercises, cable exercises, and bodyweight
exercises where appropriate.

Do not artificially limit broad muscle-group searches to only the most
popular exercises.

3. Put the most common and relevant exercise FIRST.

4. Support searches by:
- Exercise name
- Muscle group
- Body part
- Equipment
- Workout goal
- Difficulty
- Natural-language descriptions

Examples:

Search: "chest"

Good results:
- Barbell Bench Press
- Incline Dumbbell Press
- Chest Press Machine
- Cable Chest Fly
- Push-Up

Search: "rear delts"

Good results:
- Face Pull
- Reverse Pec Deck
- Bent-Over Dumbbell Reverse Fly
- Cable Rear Delt Fly

Search: "legs without equipment"

Good results:
- Bodyweight Squat
- Reverse Lunge
- Bulgarian Split Squat
- Glute Bridge
- Wall Sit

Search: "beginner back"

Good results:
- Lat Pulldown
- Seated Cable Row
- Chest-Supported Dumbbell Row
- Assisted Pull-Up

Avoid:
- Duplicate exercises
- Obscure variations unless specifically requested
- Dangerous or unnecessarily advanced exercises for beginner searches

For every exercise provide:

- name
- primaryMuscle
- secondaryMuscles
- equipment
- category
- difficulty
- instructions
- defaultSets
- defaultReps

CATEGORY must be one of:
"strength"
"cardio"
"mobility"
"bodyweight"

DIFFICULTY must be one of:
"beginner"
"intermediate"
"advanced"

INSTRUCTIONS:
Provide one short, practical sentence explaining how to perform the exercise.

DEFAULT SETS:
For strength/bodyweight exercises, usually 3.
For other categories use a sensible value.

DEFAULT REPS:
Return as a string.
Examples:
"8-12"
"10-15"
"30 sec"
"20 min"

RESPONSE FORMAT:

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not include explanations.

Return exactly:

{
  "exercises": [
    {
      "name": "Exercise name",
      "primaryMuscle": "Chest",
      "secondaryMuscles": ["Triceps", "Shoulders"],
      "equipment": "Barbell",
      "category": "strength",
      "difficulty": "intermediate",
      "instructions": "Short instruction.",
      "defaultSets": 3,
      "defaultReps": "8-12"
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

    const validCategories = [
      "strength",
      "cardio",
      "mobility",
      "bodyweight",
    ];

    const validDifficulties = [
      "beginner",
      "intermediate",
      "advanced",
    ];

    const exercises = (
      parsed.exercises || []
    )
      .slice(0, 25)
      .map((exercise, index) => ({
        id: `ai-exercise-${Date.now()}-${index}`,

        name:
          exercise.name ||
          query,

        primaryMuscle:
          exercise.primaryMuscle ||
          "Full Body",

        secondaryMuscles:
          Array.isArray(
            exercise.secondaryMuscles
          )
            ? exercise.secondaryMuscles
            : [],

        equipment:
          exercise.equipment ||
          "None",

        category:
          validCategories.includes(
            exercise.category
          )
            ? exercise.category
            : "strength",

        difficulty:
          validDifficulties.includes(
            exercise.difficulty
          )
            ? exercise.difficulty
            : "beginner",

        instructions:
          exercise.instructions ||
          "",

        defaultSets:
          Number(
            exercise.defaultSets
          ) || 3,

        defaultReps:
          String(
            exercise.defaultReps ||
            "8-12"
          ),

        source:
          "AI",
      }));

    if (
      exercises.length === 0
    ) {
      return res
        .status(404)
        .json({
          error:
            "No matching exercises found.",
        });
    }

    return res.json({
      exercises,
      source: "AI",
    });

  } catch (error) {
    console.error(
      "Exercise Search Error:",
      error
    );

    return res
      .status(500)
      .json({
        error:
          "Exercise search is temporarily unavailable.",
      });
  }
});

// =============================================
// AI WORKOUT PLAN GENERATOR
// =============================================

app.post("/api/workout-plan/generate", async (req, res) => {
  try {
    const profile = req.body;

    if (!profile || typeof profile !== "object") {
      return res.status(400).json({
        error: "User profile is required.",
      });
    }

    const prompt = `
You are the AI workout programming engine for SHRED,
a personalized health and fitness application.

Your task is to create a safe, practical and personalized
weekly workout plan based on the user's profile.

USER PROFILE:

${JSON.stringify(profile, null, 2)}

PERSONALIZATION RULES:

1. Build the plan specifically around the user's:
- Primary fitness goal
- Experience level
- Available workout days
- Session duration
- Workout location
- Available equipment
- Workout preferences
- Physical limitations, if provided

2. The number of TRAINING DAYS must match the user's
workoutDaysPerWeek when provided.

3. Include rest/recovery days for the remaining days
of the week.

4. Choose exercises appropriate for the user's
experience level and available equipment.

5. Avoid exercises that conflict with explicitly stated
physical limitations.

6. Each training day should contain a realistic number
of exercises that can be completed within the user's
session duration.

7. Use balanced programming. Avoid unnecessary exercise
duplication across the week.

8. For strength exercises, provide:
- sets
- reps
- restSeconds

9. Exercise names should be common and searchable through
the SHRED exercise search system.

10. Do not diagnose injuries or medical conditions.

PLAN SOURCE:

The generated plan must have:

"source": "ai_onboarding"

and:

"isActive": true

DATA STRUCTURE:

Return ONE complete weekly workout plan.

Each day of the week must appear exactly once.

For rest days:

"isRestDay": true
"exercises": []

For training days:

"isRestDay": false

Every exercise must follow this structure:

{
  "name": "Dumbbell Bench Press",
  "primaryMuscle": "Chest",
  "secondaryMuscles": ["Triceps", "Shoulders"],
  "equipment": "Dumbbell",
  "category": "strength",
  "difficulty": "beginner",
  "sets": 3,
  "reps": "8-12",
  "restSeconds": 90,
  "instructions": "Short practical instruction.",
  "source": "AI"
}

CATEGORY must be one of:

"strength"
"cardio"
"mobility"
"bodyweight"

DIFFICULTY must be one of:

"beginner"
"intermediate"
"advanced"

RESPONSE FORMAT:

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not include explanations.

Return exactly this structure:

{
  "name": "Personalized Workout Plan",
  "source": "ai_onboarding",
  "isActive": true,
  "days": [
    {
      "day": "Monday",
      "name": "Upper Body",
      "isRestDay": false,
      "exercises": [
        {
          "name": "Dumbbell Bench Press",
          "primaryMuscle": "Chest",
          "secondaryMuscles": ["Triceps", "Shoulders"],
          "equipment": "Dumbbell",
          "category": "strength",
          "difficulty": "beginner",
          "sets": 3,
          "reps": "8-12",
          "restSeconds": 90,
          "instructions": "Short practical instruction.",
          "source": "AI"
        }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    let text = response.text || "";

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    const validCategories = [
      "strength",
      "cardio",
      "mobility",
      "bodyweight",
    ];

    const validDifficulties = [
      "beginner",
      "intermediate",
      "advanced",
    ];

    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // -----------------------------------------
    // NORMALIZE PLAN
    // -----------------------------------------

    const planId = `plan-${Date.now()}`;

    const normalizedDays = validDays.map(
      (dayName, dayIndex) => {
        const generatedDay = (
          parsed.days || []
        ).find(
          (item) =>
            String(item.day).toLowerCase() ===
            dayName.toLowerCase()
        );

        if (!generatedDay) {
          return {
            id: `${planId}-day-${dayIndex}`,
            day: dayName,
            name: "Recovery",
            isRestDay: true,
            exercises: [],
          };
        }

        const isRestDay =
          Boolean(generatedDay.isRestDay);

        const exercises = isRestDay
          ? []
          : (
              generatedDay.exercises || []
            ).map(
              (exercise, exerciseIndex) => ({
                id: `${planId}-day-${dayIndex}-exercise-${exerciseIndex}`,

                name:
                  exercise.name ||
                  "Exercise",

                primaryMuscle:
                  exercise.primaryMuscle ||
                  "Full Body",

                secondaryMuscles:
                  Array.isArray(
                    exercise.secondaryMuscles
                  )
                    ? exercise.secondaryMuscles
                    : [],

                equipment:
                  exercise.equipment ||
                  "None",

                category:
                  validCategories.includes(
                    exercise.category
                  )
                    ? exercise.category
                    : "strength",

                difficulty:
                  validDifficulties.includes(
                    exercise.difficulty
                  )
                    ? exercise.difficulty
                    : "beginner",

                sets:
                  Math.max(
                    1,
                    Number(exercise.sets) || 3
                  ),

                reps:
                  String(
                    exercise.reps ||
                    "8-12"
                  ),

                restSeconds:
                  Math.max(
                    0,
                    Number(
                      exercise.restSeconds
                    ) || 60
                  ),

                instructions:
                  exercise.instructions ||
                  "",

                source: "AI",
              })
            );

        return {
          id: `${planId}-day-${dayIndex}`,

          day: dayName,

          name:
            generatedDay.name ||
            (isRestDay
              ? "Recovery"
              : "Workout"),

          isRestDay,

          exercises,
        };
      }
    );

    const plan = {
      id: planId,

      name:
        parsed.name ||
        "Personalized Workout Plan",

      source: "ai_onboarding",

      isActive: true,

      createdAt:
        new Date().toISOString(),

      days:
        normalizedDays,
    };

    return res.json({
      plan,
      source: "AI",
    });

  } catch (error) {
    console.error(
      "Workout Plan Generation Error:",
      error
    );

    return res.status(500).json({
      error:
        "Unable to generate workout plan right now.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `SHRED AI server running on port ${PORT}`
  );
});