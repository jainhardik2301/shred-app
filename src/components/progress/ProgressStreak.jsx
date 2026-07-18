import { useApp } from "../../contexts/AppContext";

export default function ProgressStreak() {
  const { appData } = useApp();

  const streak =
    appData.history?.weight?.length || 1;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold">
          Current Streak
        </h2>

        <span className="text-4xl">
          🔥
        </span>

      </div>

      <h1 className="mt-8 text-6xl font-bold text-orange-400">
        {streak}
      </h1>

      <p className="mt-3 text-slate-400">
        consecutive updates
      </p>

    </div>
  );
}