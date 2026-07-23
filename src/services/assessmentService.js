const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function generateAssessment(onboardingProfile) {
  const response = await fetch(
    `${API_BASE_URL}/api/assessment/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(onboardingProfile),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.error ||
        "Unable to generate personalized assessment."
    );
  }

  const data = await response.json();

  return data.assessment;
}