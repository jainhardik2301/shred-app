const API_BASE_URL =
  import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://shred-ai.onrender.com";

export async function generateWorkoutPlan(profile) {
  const response = await fetch(
    `${API_BASE_URL}/api/workout-plan/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(profile),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to generate workout plan."
    );
  }

  if (!data.plan) {
    throw new Error(
      "No workout plan was returned."
    );
  }

  return data.plan;
}