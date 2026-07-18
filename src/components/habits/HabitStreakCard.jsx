import { useApp } from "../../contexts/AppContext";

export default function HabitStreakCard() {
  const { appData } = useApp();

  const history = appData?.habitHistory || {};

  const entries = Object.entries(history)
    .map(([date, data]) => ({
      date,
      completed: Boolean(data?.completed),
      score: Number(data?.score) || 0,
    }))
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );

  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;

  entries.forEach((entry) => {
    if (entry.completed) {
      runningStreak += 1;
      bestStreak = Math.max(bestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  });

  currentStreak = runningStreak;

  const now = new Date();

  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 6);

  const weeklyEntries = entries.filter((entry) => {
    const date = new Date(entry.date);

    return date >= weekAgo && date <= now;
  });

  const weeklyScore =
    weeklyEntries.length > 0
      ? Math.round(
          weeklyEntries.reduce(
            (total, entry) => total + entry.score,
            0
          ) / weeklyEntries.length
        )
      : 0;

  return (
    <div className="rounded-2xl border border-orange-900/60 bg-orange-950/30 p-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          🔥
        </span>

        <div>
          <h2 className="text-xl font-bold">
            Habit Streak
          </h2>

          <p className="text-sm text-slate-400">
            Stay consistent every day.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-slate-400">
            Current
          </p>

          <h3 className="mt-2 text-3xl font-bold text-orange-400">
            {currentStreak}
          </h3>

          <p className="text-xs text-slate-400">
            days
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Best
          </p>

          <h3 className="mt-2 text-3xl font-bold text-emerald-400">
            {bestStreak}
          </h3>

          <p className="text-xs text-slate-400">
            days
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            This Week
          </p>

          <h3 className="mt-2 text-3xl font-bold text-sky-400">
            {weeklyScore}%
          </h3>

          <p className="text-xs text-slate-400">
            completed
          </p>
        </div>
      </div>
    </div>
  );
}