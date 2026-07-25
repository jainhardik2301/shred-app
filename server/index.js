import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { buildCoachContext } from "./utils/buildCoachContext.js";

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

// =============================================
// AI ONBOARDING ASSESSMENT
// =============================================

app.post("/api/assessment/generate", async (req, res) => {
  try {
    const profile = req.body;

    if (!profile || typeof profile !== "object") {
      return res.status(400).json({
        error: "Onboarding profile is required.",
      });
    }

    const prompt = `
You are the AI health, nutrition and fitness assessment engine for SHRED,
a personalized health and fitness application.

Your task is to analyze a user's complete onboarding profile and provide
a practical, personalized starting assessment.

USER ONBOARDING PROFILE:

${JSON.stringify(profile, null, 2)}

IMPORTANT RULES:

1. Personalize the assessment specifically to the user's:
- Current weight and target weight
- Primary goal and motivations
- Activity level and daily movement
- Work and sitting habits
- Sleep and stress
- Nutrition habits
- Water intake
- Diet preference
- Protein preferences
- Training experience
- Available equipment
- Workout schedule
- Behavioural challenges
- Confidence and commitment
- Medical conditions
- Injuries and physical limitations
- Nutritional deficiencies

2. Identify the user's biggest opportunities for improvement.

3. Be realistic about the user's target weight and target date.
Do not promise a specific amount of weight loss.

4. Do not recommend crash diets, starvation diets, water-only fasting,
extreme calorie restriction or unsafe exercise practices.

5. Do not diagnose medical conditions or provide medical treatment.

6. If the user reports medical conditions, injuries, medications,
restrictions or concerning symptoms, include an appropriate safety note.

7. Recommendations must be practical and sustainable.

8. Calculate or estimate appropriate targets where sufficient data exists,
but clearly treat them as starting estimates rather than medical prescriptions.

9. Keep observations concise enough to display in a fitness application.

10. Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not include text outside the JSON.

11. Generate a complete 7-day meal plan from Monday through Sunday.

12. Every day must contain practical meal recommendations based on the user's preferred number of meals per day.

13. Include appropriate snacks only when they fit the user's meal frequency, calorie target, lifestyle or hunger patterns.

14. Avoid making all seven days identical. Provide meaningful food variety while keeping ingredients practical and accessible.

15. Reuse ingredients intelligently where appropriate so the weekly plan remains realistic and does not require buying completely different ingredients every day.

16. Every day's meals should approximately align with the user's daily calorie and protein targets.

17. Provide practical portion guidance such as grams, bowls, cups, rotis or serving sizes where appropriate. Do not claim laboratory-level nutritional precision.

18. For Indian users or users whose food preferences indicate Indian eating patterns, prioritize practical Indian meal options while incorporating other foods they already consume or prefer.

19. Respect vegetarian, vegan, non-vegetarian, allergy and intolerance information strictly across all seven days.

20. Include higher-protein alternatives where useful, especially when the user's protein target is relatively high.

21. The weekly meal plan should be sustainable and flexible rather than a rigid clinical diet prescription.

RETURN EXACTLY THIS STRUCTURE:

{
  "summary": "2-4 sentence personalized overall assessment.",

  "keyObservations": [
    "Observation 1",
    "Observation 2",
    "Observation 3"
  ],

  "strengths": [
    "Existing positive factor 1",
    "Existing positive factor 2"
  ],

  "priorityAreas": [
    {
      "title": "Priority title",
      "description": "Why this matters and what the user should focus on."
    }
  ],

  "goalAssessment": {
    "status": "realistic",
    "message": "Assessment of the user's goal and timeline."
  },

  "nutritionAssessment": {
    "summary": "Personalized nutrition assessment.",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  },

  "activityAssessment": {
    "summary": "Personalized activity and lifestyle assessment.",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  },

  "trainingAssessment": {
    "summary": "Personalized training assessment.",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  },

  "recoveryAssessment": {
    "summary": "Personalized sleep, stress and recovery assessment.",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  },

  "startingTargets": {
    "dailyCalories": 0,
    "proteinGrams": 0,
    "waterLiters": 0,
    "dailySteps": 0,
    "workoutDays": 0
  },

  "expectedProgress": {
    "summary": "Realistic description of what progress may look like."
  },

  "safetyNotes": [
    "Relevant safety note if applicable"
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

    const assessment = JSON.parse(text);

    return res.json({
      assessment,
      source: "AI",
    });
  } catch (error) {
    console.error(
      "Assessment Generation Error:",
      error
    );

    return res.status(500).json({
      error:
        "Unable to generate your personalized assessment right now.",
    });
  }
});

// =============================================
// AI PERSONALIZED NUTRITION PLAN
// =============================================

app.post("/api/nutrition-plan/generate", async (req, res) => {
  try {
    const { profile, assessment } = req.body;

    if (!profile || typeof profile !== "object") {
      return res.status(400).json({
        error: "User profile is required.",
      });
    }

    const prompt = `
You are the AI nutrition planning engine for SHRED,
a personalized health and fitness application.

Create a practical and sustainable personalized nutrition plan
based on the user's onboarding profile and AI health assessment.

USER ONBOARDING PROFILE:

${JSON.stringify(profile, null, 2)}

USER AI ASSESSMENT:

${JSON.stringify(assessment || {}, null, 2)}

IMPORTANT RULES:

1. Personalize the plan based on:
- Primary fitness goal
- Current and target weight
- Calorie and protein targets
- Diet type
- Food preferences
- Foods disliked
- Allergies and intolerances
- Typical existing diet
- Meal frequency preference
- Fasting preference
- Hunger and cravings
- Binge eating tendencies
- Water intake
- Work schedule and lifestyle
- Restaurant/junk food frequency
- Medical conditions if provided

2. Respect the user's dietary restrictions.
For example, never recommend eggs or meat to a strict vegetarian.

3. Use foods that are practical and culturally appropriate
based on the user's existing diet and preferences.

4. Do NOT prescribe crash diets, starvation diets,
water-only fasting or extreme calorie restriction.

5. Do NOT treat suggested meals as food the user has already consumed.

6. Meal examples are recommendations, not mandatory prescriptions.

7. Keep the plan practical enough for long-term adherence.

8. Protein recommendations should align approximately with
the user's personalized protein target.

9. Daily meal examples should approximately align with the
user's calorie target but do not claim exact nutritional precision.

10. Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not include text outside JSON.

RETURN EXACTLY THIS STRUCTURE:

{
  "name": "My Personalized Nutrition Plan",

  "summary": "Short personalized overview of the nutrition strategy.",

  "dailyTargets": {
    "calories": 0,
    "protein": 0,
    "water": 0
  },

  "mealStructure": {
    "mealsPerDay": 3,
    "description": "Recommended daily meal structure."
  },

  "weeklyMealPlan": [
  {
    "day": "Monday",
    "meals": [
      {
        "meal": "Breakfast",
        "foods": [
          "Food suggestion with practical portion guidance",
          "Food suggestion with practical portion guidance"
        ],
        "guidance": "Short personalized guidance for this meal."
      },
      {
        "meal": "Lunch",
        "foods": [
          "Food suggestion with practical portion guidance",
          "Food suggestion with practical portion guidance"
        ],
        "guidance": "Short personalized guidance for this meal."
      },
      {
        "meal": "Evening Snack",
        "foods": [
          "Food suggestion with practical portion guidance"
        ],
        "guidance": "Short personalized guidance for this meal."
      },
      {
        "meal": "Dinner",
        "foods": [
          "Food suggestion with practical portion guidance",
          "Food suggestion with practical portion guidance"
        ],
        "guidance": "Short personalized guidance for this meal."
      }
    ]
  },
  {
    "day": "Tuesday",
    "meals": []
  },
  {
    "day": "Wednesday",
    "meals": []
  },
  {
    "day": "Thursday",
    "meals": []
  },
  {
    "day": "Friday",
    "meals": []
  },
  {
    "day": "Saturday",
    "meals": []
  },
  {
    "day": "Sunday",
    "meals": []
  }
],

  "proteinStrategy": [
    "Personalized protein recommendation"
  ],

  "hydrationStrategy": [
    "Personalized hydration recommendation"
  ],

  "cravingStrategy": [
    "Personalized craving management recommendation"
  ],

  "eatingOutStrategy": [
    "Personalized restaurant or social eating recommendation"
  ],

  "foodsToPrioritize": [
    "Food or food group"
  ],

  "foodsToLimit": [
    "Food or food group"
  ],

  "flexibilityRules": [
    "Practical sustainability rule"
  ],

  "notes": [
    "Any relevant personalized note"
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

const dailyCoach =
  JSON.parse(text);

    const nutritionPlan = JSON.parse(text);

    return res.json({
      nutritionPlan: {
        ...nutritionPlan,
        id: `nutrition-plan-${Date.now()}`,
        source: "ai_onboarding",
        createdAt: new Date().toISOString(),
      },
      source: "AI",
    });
  } catch (error) {
    console.error(
      "Nutrition Plan Generation Error:",
      error
    );

    return res.status(500).json({
      error:
        "Unable to generate your personalized nutrition plan right now.",
    });
  }
});

app.post("/api/daily-coach/generate", async (req, res) => {
  try {
    const {
      onboardingProfile,
      assessment,
      nutritionPlan,
      activeWorkoutPlan,
      todayWorkout,
      todayProgress,
      workoutCompletedToday,
      currentDateTime,
    } = req.body;

    const coachContext = buildCoachContext(req.body);

    console.log("\n========== COACH CONTEXT ==========");
console.dir(coachContext, { depth: null });
console.log("===================================\n");
    
    if (!onboardingProfile) {
      return res.status(400).json({
        error: "Onboarding profile is required.",
      });
    }

    const prompt = `
You are SHRED AI, a highly personalized fitness, nutrition,
habit and recovery coach.

Your job is to analyze the user's CURRENT DAY and identify
the SINGLE MOST IMPORTANT action or focus that will help them
make progress today.

This is not a general motivational message.

Your recommendation must be based on the user's actual profile,
goals, current progress, workout schedule, nutrition progress,
activity and recovery context.

PERSONALIZED USER CONTEXT:

${JSON.stringify(coachContext, null, 2)}


COACHING RULES:

1. Identify the SINGLE highest-priority focus for the user
right now.

2. Consider the current time of day before evaluating progress.
For example, low calories or protein early in the morning is
normal and should not automatically trigger a warning.

3. Compare actual progress against personalized daily targets
for calories, protein, water and steps.

4. Consider whether today's workout is scheduled, completed,
in progress, or a rest day.

5. If the workout is completed, prioritize recovery when
appropriate, including protein, hydration, mobility or sleep.

6. If a workout is scheduled but not completed, consider the
time of day before deciding whether training should be the
priority.

7. Consider the user's known injuries, medical limitations,
lifestyle challenges, cravings, sleep patterns and work
schedule when relevant.

8. Do not provide medical diagnoses.

9. Do not recommend exercises or activities that conflict with
the user's reported injuries or restrictions.

10. Avoid generic motivation such as:
"Keep going"
"Stay consistent"
"You've got this"

Every recommendation must contain a specific reason and
a practical next action.

11. Do not criticize the user for incomplete progress early
in the day.

12. Keep the main insight concise enough to display on a
Dashboard.

13. Generate 2 to 3 specific action steps that the user can
realistically complete today.

14. The tone should be supportive, intelligent, concise and
practical.

15. Do not invent tracked data that is not present in the
provided context.

16. If important tracking data is unavailable, base the
recommendation only on the information that is available.

17. Return ONLY valid JSON. Do not use markdown or code fences.


RETURN EXACTLY THIS JSON STRUCTURE:

{
  "priority": "nutrition | workout | movement | hydration | recovery | sleep | general",

  "title": "Short personalized headline",

  "insight": "2-3 sentence personalized explanation of why this is today's most important focus.",

  "actions": [
    "Specific practical action 1",
    "Specific practical action 2",
    "Specific practical action 3"
  ],

  "reason": "Short explanation of the key data or context that triggered this recommendation.",

  "generatedAt": "ISO timestamp"
}
`;

    const response =
  await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

let text = response.text || "";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const dailyCoach =
      JSON.parse(text);

    dailyCoach.generatedAt =
      new Date().toISOString();

    res.json(dailyCoach);

  } catch (error) {
    console.error(
      "Daily Coach Generation Error:",
      error
    );

    res.status(500).json({
      error:
        "Unable to generate today's coaching insight.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `SHRED AI server running on port ${PORT}`
  );
});