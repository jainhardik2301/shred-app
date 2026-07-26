const MAX_HISTORY = 30;

export function buildHistoryEntry(appData, dailyCoach) {
  const today = appData?.today || {};
  const assessment = appData?.assessment || {};

  return {
    date: new Date().toISOString(),

    weight:
      assessment.currentWeight ??
      assessment.weight ??
      null,

    calories:
      today.calories ?? 0,

    protein:
      today.protein ?? 0,

    water:
      today.water ?? 0,

    steps:
      today.steps ?? 0,

    sleep:
      today.sleep ?? 0,

    workoutCompleted:
      dailyCoach?.workoutCompletedToday ?? false,

    priority:
      dailyCoach?.priority ?? null,

    title:
      dailyCoach?.title ?? null,
  };
}

export function updateHistory(history = [], entry) {
  return [...history, entry].slice(-MAX_HISTORY);
}

export function buildTrendSummary(history = []) {
  if (!history.length) {
    return {
      adherence: 0,
      workoutRate: 0,
      avgProtein: 0,
      avgCalories: 0,
      avgWater: 0,
      avgSteps: 0,
    };
  }

  const totals = history.reduce(
    (acc, day) => {
      acc.protein += day.protein || 0;
      acc.calories += day.calories || 0;
      acc.water += day.water || 0;
      acc.steps += day.steps || 0;

      if (day.workoutCompleted)
        acc.workouts++;

      return acc;
    },
    {
      protein: 0,
      calories: 0,
      water: 0,
      steps: 0,
      workouts: 0,
    }
  );

  const days = history.length;

  return {
    adherence:
      Math.round(
        (totals.workouts / days) * 100
      ),

    workoutRate:
      totals.workouts,

    avgProtein:
      Math.round(totals.protein / days),

    avgCalories:
      Math.round(totals.calories / days),

    avgWater:
      Math.round(totals.water / days),

    avgSteps:
      Math.round(totals.steps / days),
  };
}