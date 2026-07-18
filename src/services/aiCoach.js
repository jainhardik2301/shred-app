import {
  formatWeight,
  formatHeight,
} from "../utils/unitConversions";

function buildHistoricalSummary(appData) {
  const history =
    appData?.dailyHistory || {};

  const last7Days = Object.entries(history)
    .sort(([a], [b]) =>
      b.localeCompare(a)
    )
    .slice(0, 7);

  if (last7Days.length === 0) {
    return {
      daysTracked: 0,
      message:
        "No completed historical days available yet.",
    };
  }

  const totals = last7Days.reduce(
    (acc, [, day]) => {
      acc.calories +=
        Number(
          day?.nutrition?.calories
        ) || 0;

      acc.protein +=
        Number(
          day?.nutrition?.protein
        ) || 0;

      acc.water +=
        Number(
          day?.habits?.water
        ) || 0;

      acc.steps +=
        Number(
          day?.habits?.steps
        ) || 0;

      acc.sleep +=
        Number(
          day?.habits?.sleep
        ) || 0;

      acc.workouts +=
        Array.isArray(
          day?.workouts
        )
          ? day.workouts.length
          : 0;

      return acc;
    },
    {
      calories: 0,
      protein: 0,
      water: 0,
      steps: 0,
      sleep: 0,
      workouts: 0,
    }
  );

  const days =
    last7Days.length;

  return {
    period: "Last 7 completed tracked days",

    daysTracked: days,

    averageCalories:
      Math.round(
        totals.calories / days
      ),

    averageProtein:
      Number(
        (
          totals.protein / days
        ).toFixed(1)
      ),

    averageWater:
      Number(
        (
          totals.water / days
        ).toFixed(2)
      ),

    averageSteps:
      Math.round(
        totals.steps / days
      ),

    averageSleep:
      Number(
        (
          totals.sleep / days
        ).toFixed(1)
      ),

    workoutsCompleted:
      totals.workouts,
  };
}
export async function askAICoach(
  message,
  appData
) {
  const weightUnit =
    appData?.preferences?.weightUnit ||
    "kg";

  const heightUnit =
    appData?.preferences?.heightUnit ||
    "cm";

  const currentWeight =
    appData?.profile?.weight;

  const targetWeight =
    appData?.goals?.targetWeight;

  const context = {
    preferences: {
      weightUnit,
      heightUnit,

      instruction:
        `Always use ${weightUnit} for weight and ${
          heightUnit === "ft"
            ? "feet/inches"
            : "cm"
        } for height when responding to the user.`,
    },

    profile: {
      weight:
        currentWeight
          ? formatWeight(
              currentWeight,
              weightUnit
            )
          : null,

      height:
        appData?.profile?.height
          ? formatHeight(
              appData.profile.height,
              heightUnit
            )
          : null,

      bmi:
        appData?.profile?.bmi ||
        null,

      age:
        appData?.profile?.age ||
        null,

      gender:
        appData?.profile?.gender ||
        null,
    },

    goals: {
      ...(appData?.goals || {}),

      targetWeight:
        targetWeight
          ? formatWeight(
              targetWeight,
              weightUnit
            )
          : null,
    },

    today:
      appData?.today || {},

    meals:
      Array.isArray(
        appData?.meals
      )
        ? appData.meals
        : [],

    workoutSchedule:
      appData?.activeSchedule ||
      {},

    recentWorkouts:
      Array.isArray(
        appData?.workoutHistory
      )
        ? appData.workoutHistory.slice(
            -5
          )
        : [],

    recentWeightHistory:
      Array.isArray(
        appData?.history?.weight
      )
        ? appData.history.weight
            .slice(-10)
            .map((entry) => ({
              ...entry,

              weight:
                formatWeight(
                  entry.value,
                  weightUnit
                ),

              // Remove raw kg value
              // sent by the existing history
              value: undefined,
            }))
        : [],

    recentDailyHistory:
      Object.entries(
        appData?.dailyHistory ||
          {}
      )
        .sort(([a], [b]) =>
          b.localeCompare(a)
        )
        .slice(0, 7)
        .reduce(
          (
            result,
            [date, data]
          ) => {
            result[date] =
              data;

            return result;
          },
          {}
        ),
        historicalSummary:
  buildHistoricalSummary(appData),
  };

  const response =
    await fetch("https://shred-ai.onrender.com/api/coach",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message,
          context,
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "AI Coach request failed."
    );
  }

  const data =
    await response.json();

  return data.reply;
}