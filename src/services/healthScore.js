export function calculateHealthScore(appData) {
  const today = appData?.today || {};
  const goals = appData?.goals || {};

  const stepsGoal =
    Number(goals.steps) ||
    Number(goals.stepGoal) ||
    0;

  const metrics = [
    Number(goals.protein) > 0
      ? (Number(today.protein) || 0) /
        Number(goals.protein)
      : 0,

    Number(goals.water) > 0
      ? (Number(today.water) || 0) /
        Number(goals.water)
      : 0,

    Number(goals.calories) > 0
      ? (Number(today.calories) || 0) /
        Number(goals.calories)
      : 0,

    stepsGoal > 0
      ? (Number(today.steps) || 0) /
        stepsGoal
      : 0,

    (Number(today.sleep) || 0) / 8,
  ];

  const total = metrics.reduce(
    (sum, value) =>
      sum + Math.min(Math.max(value, 0), 1),
    0
  );

  return Math.round(
    (total / metrics.length) * 100
  );
}