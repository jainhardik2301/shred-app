import { useApp } from "../../contexts/AppContext";

export default function DailyStreak() {
  const { appData } = useApp();

  const dailyHistory =
    appData?.dailyHistory || {};

  const today = appData?.today || {};

  function isActiveDay(day) {
    if (!day) return false;

    const nutrition = day.nutrition || {};
    const habits = day.habits || {};

    return (
      (Number(nutrition.calories) || 0) > 0 ||
      (Number(nutrition.protein) || 0) > 0 ||
      (Number(habits.water) || 0) > 0 ||
      (Number(habits.steps) || 0) > 0 ||
      (Number(habits.sleep) || 0) > 0 ||
      (Array.isArray(day.meals) &&
        day.meals.length > 0) ||
      (Array.isArray(day.workouts) &&
        day.workouts.length > 0)
    );
  }

  const todayIsActive =
    (Number(today.calories) || 0) > 0 ||
    (Number(today.protein) || 0) > 0 ||
    (Number(today.water) || 0) > 0 ||
    (Number(today.steps) || 0) > 0 ||
    (Number(today.sleep) || 0) > 0 ||
    (Array.isArray(appData?.meals) &&
      appData.meals.length > 0);

  let streak = todayIsActive ? 1 : 0;

  const date = new Date();

  if (!todayIsActive) {
    date.setDate(date.getDate() - 1);
  }

  while (true) {
    const dateKey =
      date.toLocaleDateString("en-CA");

    const day =
      dailyHistory[dateKey];

    if (!isActiveDay(day)) {
      break;
    }

    streak += 1;

    date.setDate(
      date.getDate() - 1
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">
        Daily Streak
      </h2>

      <div className="mt-8 text-center">
        <h1 className="text-6xl">
          🔥
        </h1>

        <h2 className="mt-4 text-5xl font-bold text-orange-400">
          {streak}
        </h2>

        <p className="mt-2 text-slate-400">
          {streak === 1
            ? "Day Streak"
            : "Day Streak"}
        </p>
      </div>
    </div>
  );
}