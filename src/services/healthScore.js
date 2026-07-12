export function calculateHealthScore(appData) {
  const { today, goals } = appData;

  const metrics = [
    goals.protein > 0 ? today.protein / goals.protein : 0,
    goals.water > 0 ? today.water / goals.water : 0,
    goals.calories > 0 ? today.calories / goals.calories : 0,
    goals.stepGoal > 0 ? today.steps / goals.stepGoal : 0,
    today.sleep / 8, // Default sleep goal: 8 hours
  ];

  const total = metrics.reduce(
    (sum, value) => sum + Math.min(value, 1),
    0
  );

  return Math.round((total / metrics.length) * 100);
}