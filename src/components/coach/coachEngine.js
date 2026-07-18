function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getTodayData(appData) {
  const today = appData?.today || {};
  const goals = appData?.goals || {};
  const profile = appData?.profile || {};
  const meals = Array.isArray(appData?.meals)
    ? appData.meals
    : [];
  const workoutPlans = Array.isArray(appData?.workoutPlans)
    ? appData.workoutPlans
    : [];
  const workoutHistory = Array.isArray(appData?.workoutHistory)
    ? appData.workoutHistory
    : [];

  return {
    calories: num(today.calories),
    protein: num(today.protein),
    water: num(today.water),
    steps: num(today.steps),
    sleep: num(today.sleep),

    calorieGoal: num(goals.calories),
    proteinGoal: num(goals.protein),
    waterGoal: num(goals.water),
    stepsGoal: num(goals.steps),

    currentWeight: num(profile?.weight),
    targetWeight: num(goals.targetWeight),

    meals,
    workoutPlans,
    workoutHistory,
  };
}

export function getTodaysWorkout(appData) {
  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const planId = appData?.activeSchedule?.[todayName];

  if (!planId) {
    return {
      day: todayName,
      plan: null,
    };
  }

  const plans = Array.isArray(appData?.workoutPlans)
    ? appData.workoutPlans
    : [];

  const plan =
    plans.find(
      (item) => String(item.id) === String(planId)
    ) || null;

  return {
    day: todayName,
    plan,
  };
}

export function calculateReadiness(appData) {
  const data = getTodayData(appData);

  const scores = [];

  if (data.proteinGoal > 0) {
    scores.push(
      Math.min(data.protein / data.proteinGoal, 1)
    );
  }

  if (data.waterGoal > 0) {
    scores.push(
      Math.min(data.water / data.waterGoal, 1)
    );
  }

  if (data.stepsGoal > 0) {
    scores.push(
      Math.min(data.steps / data.stepsGoal, 1)
    );
  }

  if (data.sleep > 0) {
    scores.push(
      Math.min(data.sleep / 8, 1)
    );
  } else {
    scores.push(0);
  }

  if (scores.length === 0) {
    return 0;
  }

  return Math.round(
    (scores.reduce((total, score) => total + score, 0) /
      scores.length) *
      100
  );
}

export function generateCoachInsights(appData) {
  const data = getTodayData(appData);

  const insights = [];

  if (
    data.proteinGoal > 0 &&
    data.protein < data.proteinGoal
  ) {
    const remaining =
      data.proteinGoal - data.protein;

    insights.push({
      priority:
        data.protein <
        data.proteinGoal * 0.5
          ? 1
          : 2,
      title: "Protein",
      message: `${remaining.toFixed(
        0
      )} g remaining today.`,
    });
  }

  if (
    data.waterGoal > 0 &&
    data.water < data.waterGoal
  ) {
    const remaining =
      data.waterGoal - data.water;

    insights.push({
      priority:
        data.water <
        data.waterGoal * 0.5
          ? 1
          : 2,
      title: "Hydration",
      message: `${remaining.toFixed(
        1
      )} L remaining today.`,
    });
  }

  if (
    data.stepsGoal > 0 &&
    data.steps < data.stepsGoal
  ) {
    const remaining =
      data.stepsGoal - data.steps;

    insights.push({
      priority:
        data.steps <
        data.stepsGoal * 0.5
          ? 1
          : 2,
      title: "Movement",
      message: `${Math.round(
        remaining
      ).toLocaleString()} steps remaining.`,
    });
  }

  if (data.sleep > 0 && data.sleep < 7) {
    insights.push({
      priority: 1,
      title: "Recovery",
      message: `You logged ${data.sleep} hours of sleep. Keep today's training intensity and recovery in mind.`,
    });
  }

  const { plan } = getTodaysWorkout(appData);

  if (plan) {
    insights.push({
      priority: 3,
      title: "Today's Workout",
      message: `${plan.name} is scheduled for today.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      priority: 4,
      title: "Looking Good",
      message:
        "Your tracked goals are currently in a good position.",
    });
  }

  return insights
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4);
}

export function generateDailySummary(appData) {
  const data = getTodayData(appData);
  const { plan } = getTodaysWorkout(appData);

  const recommendations = [];

  if (
    data.proteinGoal > 0 &&
    data.protein < data.proteinGoal * 0.7
  ) {
    recommendations.push(
      "Protein intake is currently behind target"
    );
  }

  if (
    data.waterGoal > 0 &&
    data.water < data.waterGoal * 0.7
  ) {
    recommendations.push(
      "hydration needs attention"
    );
  }

  if (
    data.stepsGoal > 0 &&
    data.steps < data.stepsGoal * 0.6
  ) {
    recommendations.push(
      "activity is below your daily target"
    );
  }

  if (data.sleep > 0 && data.sleep < 7) {
    recommendations.push(
      "recovery may be limited due to lower sleep"
    );
  }

  let summary = "";

  if (recommendations.length > 0) {
    summary =
      recommendations
        .map(
          (item, index) =>
            index === 0
              ? item.charAt(0).toUpperCase() +
                item.slice(1)
              : item
        )
        .join(", ") + ".";
  } else {
    summary =
      "Your tracked metrics are currently looking balanced.";
  }

  if (plan) {
    summary += ` Today's scheduled workout is ${plan.name}.`;
  } else {
    summary +=
      " No workout is currently scheduled for today.";
  }

  return summary;
}

export function generateCoachResponse(message, appData) {
  const text = message.toLowerCase().trim();

  const data = getTodayData(appData);
  const { plan } = getTodaysWorkout(appData);

  if (
    text.includes("analyze my day") ||
    text.includes("how am i doing") ||
    text.includes("today")
  ) {
    return generateDailySummary(appData);
  }

  if (
    text.includes("eat") ||
    text.includes("food") ||
    text.includes("protein")
  ) {
    const proteinRemaining = Math.max(
      0,
      data.proteinGoal - data.protein
    );

    const caloriesRemaining = Math.max(
      0,
      data.calorieGoal - data.calories
    );

    if (
      data.proteinGoal > 0 &&
      proteinRemaining > 20
    ) {
      return `You have approximately ${proteinRemaining.toFixed(
        0
      )} g of protein remaining${
        data.calorieGoal > 0
          ? ` and about ${caloriesRemaining.toFixed(
              0
            )} kcal remaining`
          : ""
      }. Prioritize a protein-rich meal such as paneer, hung curd, Greek yogurt, sprouts, tofu or kala chana, while keeping your remaining calories in mind.`;
    }

    return `You've logged approximately ${data.calories.toFixed(
      0
    )} kcal and ${data.protein.toFixed(
      1
    )} g protein today. Your protein intake is reasonably covered, so focus on vegetables, fibre and calorie balance.`;
  }

  if (
    text.includes("train") ||
    text.includes("workout") ||
    text.includes("exercise")
  ) {
    if (data.sleep > 0 && data.sleep < 6) {
      return `You logged ${data.sleep} hours of sleep. Recovery appears limited, so consider reducing workout intensity.${
        plan
          ? ` Your scheduled workout is ${plan.name}.`
          : ""
      }`;
    }

    if (plan) {
      return `Your scheduled workout today is ${plan.name}.${
        data.sleep >= 7
          ? " Your sleep indicates reasonable recovery, so you should be in a good position to train if you're feeling physically well."
          : " Listen to your energy levels and adjust intensity if needed."
      }`;
    }

    return "No workout is currently scheduled for today. You can use today as a rest or recovery day, or assign a workout from your Workout schedule.";
  }

  if (
    text.includes("progress") ||
    text.includes("weight")
  ) {
    if (
      !data.currentWeight ||
      !data.targetWeight
    ) {
      return "Add your current weight and target weight to enable detailed progress analysis.";
    }

    const remaining =
      data.currentWeight - data.targetWeight;

    if (remaining <= 0) {
      return `Your current weight is ${data.currentWeight} kg and your target is ${data.targetWeight} kg. You've reached or moved beyond your current target.`;
    }

    return `Your current weight is ${data.currentWeight} kg and your target is ${data.targetWeight} kg. You have ${remaining.toFixed(
      1
    )} kg remaining. Focus on your multi-week weight trend rather than individual daily changes.`;
  }

  if (text.includes("calorie")) {
    if (!data.calorieGoal) {
      return `You've consumed approximately ${data.calories.toFixed(
        0
      )} kcal today. Set a calorie goal to track how much you have remaining.`;
    }

    const remaining = Math.max(
      0,
      data.calorieGoal - data.calories
    );

    return `You've consumed approximately ${data.calories.toFixed(
      0
    )} of ${data.calorieGoal.toFixed(
      0
    )} kcal today. You have approximately ${remaining.toFixed(
      0
    )} kcal remaining.`;
  }

  if (
    text.includes("water") ||
    text.includes("hydration")
  ) {
    if (!data.waterGoal) {
      return `You've logged ${data.water.toFixed(
        1
      )} L of water today.`;
    }

    const remaining = Math.max(
      0,
      data.waterGoal - data.water
    );

    return `You've logged ${data.water.toFixed(
      1
    )} L of your ${data.waterGoal.toFixed(
      1
    )} L water goal. ${remaining.toFixed(
      1
    )} L remaining.`;
  }

  if (text.includes("step")) {
    const remaining = Math.max(
      0,
      data.stepsGoal - data.steps
    );

    return data.stepsGoal
      ? `You've completed ${data.steps.toLocaleString()} of ${data.stepsGoal.toLocaleString()} steps. ${remaining.toLocaleString()} steps remaining.`
      : `You've completed ${data.steps.toLocaleString()} steps today.`;
  }

  if (text.includes("sleep")) {
    if (!data.sleep) {
      return "You haven't logged your sleep yet today.";
    }

    return data.sleep >= 7
      ? `You logged ${data.sleep} hours of sleep, which supports reasonable recovery today.`
      : `You logged ${data.sleep} hours of sleep. Recovery should be a priority today.`;
  }

  if (text.includes("meal")) {
    return `You've logged ${data.meals.length} food ${
      data.meals.length === 1 ? "item" : "items"
    } today, totalling approximately ${data.calories.toFixed(
      0
    )} kcal and ${data.protein.toFixed(
      1
    )} g protein.`;
  }

  return "I can analyze your daily performance, nutrition, remaining calories and protein, hydration, steps, sleep, scheduled workout and weight progress. Try asking me to analyze your day.";
}