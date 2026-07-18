import { useApp } from "../../contexts/AppContext";
import { calculateReadiness } from "./coachEngine";

export default function CoachSummary() {
  const { appData } = useApp();

  const today = appData?.today || {};

  const sleep = Number(today.sleep) || 0;
  const steps = Number(today.steps) || 0;

  const score = calculateReadiness(appData);

  let status = "Getting Started";

  if (score >= 80) {
    status = "Strong Day";
  } else if (score >= 60) {
    status = "On Track";
  } else if (score >= 40) {
    status = "Needs Attention";
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">
        Today's Readiness
      </p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h2 className="text-5xl font-bold text-emerald-400">
            {score}%
          </h2>

          <p className="mt-2 font-semibold text-white">
            {status}
          </p>
        </div>

        <div className="text-right text-sm text-slate-400">
          <p>{sleep} hrs sleep</p>

          <p className="mt-1">
            {steps.toLocaleString()} steps
          </p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{
            width: `${Math.min(score, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}