import { useApp } from "../../contexts/AppContext";
import { calculateHealthScore } from "../../services/healthScore";

export default function HealthScoreCard() {
  const { appData } = useApp();

if (!appData.goals || !appData.today) {
  return null;
}

const score = calculateHealthScore(appData);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Health Score
        </h3>

        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
          {
  score >= 90
    ? "Elite"
    : score >= 80
    ? "Excellent"
    : score >= 70
    ? "Good"
    : score >= 60
    ? "Average"
    : "Needs Work"
}
        </span>
      </div>

      <div className="mt-6">

        <h1 className="text-6xl font-bold text-emerald-400">
          {score}
        </h1>

        <p className="mt-2 text-slate-400">
          out of 100
        </p>

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {
  score >= 80
    ? "Excellent consistency"
    : "Keep improving every day"
}
      </p>

    </div>
  );
}