const API_BASE_URL =
  import.meta.env.DEV
    ? "http://localhost:3001"
    : "https://shred-ai.onrender.com";

export async function generateDailyCoachInsight(
  coachData
) {
  const response = await fetch(
    `${API_BASE_URL}/api/daily-coach/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(coachData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Unable to generate today's coaching insight."
    );
  }

  if (!data.title || !data.insight) {
    throw new Error(
      "Invalid coaching insight received."
    );
  }

  return data;
}