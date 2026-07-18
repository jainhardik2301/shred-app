import { useApp } from "../../contexts/AppContext";

export default function DailyHabitScore() {
  const { appData } = useApp();

  const water = Number(appData?.today?.water) || 0;
  const steps = Number(appData?.today?.steps) || 0;
  const sleep = Number(appData?.today?.sleep) || 0;

  const waterGoal = Number(appData?.goals?.water) || 3.4;
  const stepsGoal = Number(appData?.goals?.steps) || 10000;

  const waterScore =
    waterGoal > 0
      ? Math.min(water / waterGoal, 1)
      : 0;

  const stepsScore =
    stepsGoal > 0
      ? Math.min(steps / stepsGoal, 1)
      : 0;

  const sleepScore =
    Math.min(sleep / 7, 1);

  const score = Math.round(
    ((waterScore + stepsScore + sleepScore) / 3) * 100
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="font-bold">
        Daily Habit Score
      </h2>

      <h1 className="mt-6 text-5xl font-bold text-emerald-400">
        {score}%
      </h1>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{
            width: `${score}%`,
          }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Based on today's habits
      </p>
    </div>
  );
}