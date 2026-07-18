import { useApp } from "../../contexts/AppContext";
import { generateCoachInsights } from "./coachEngine";

export default function CoachInsights() {
  const { appData } = useApp();

  const insights =
    generateCoachInsights(appData);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold text-white">
        Coach Insights
      </h2>

      <div className="mt-6 space-y-3">
        {insights.map((insight, index) => (
          <div
            key={`${insight.title}-${index}`}
            className="rounded-xl bg-slate-800 p-4"
          >
            <h3 className="font-semibold text-emerald-400">
              {insight.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {insight.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}