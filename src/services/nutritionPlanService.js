const API_BASE_URL =
  import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://shred-ai.onrender.com";

export async function generateNutritionPlan(
  profile,
  assessment
) {
  const response = await fetch(
    `${API_BASE_URL}/api/nutrition-plan/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        profile,
        assessment,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to generate nutrition plan."
    );
  }

  if (!data.nutritionPlan) {
    throw new Error(
      "No nutrition plan was returned."
    );
  }

  return data.nutritionPlan;
}