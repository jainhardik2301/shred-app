import { useApp } from "../../contexts/AppContext";

import CoachSummary from "./CoachSummary";
import CoachInsights from "./CoachInsights";
import CoachChat from "./CoachChat";

import {
  generateDailySummary,
  getTodaysWorkout,
} from "./coachEngine";

export default function CoachDashboard() {
  const { appData } = useApp();

  const dailySummary =
    generateDailySummary(appData);

  const { plan } =
    getTodaysWorkout(appData);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          AI Coach
        </h1>

        <p className="mt-2 text-slate-400">
          Personalized guidance based on your
          nutrition, habits, workouts and progress.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CoachSummary />

        <CoachInsights />
      </div>

      <div className="rounded-2xl border border-emerald-900 bg-slate-900 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
          Daily Coach Summary
        </p>

        <p className="mt-3 text-lg leading-relaxed text-slate-200">
          {dailySummary}
        </p>

        {plan && (
          <div className="mt-5 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">
              Today's Workout
            </p>

            <p className="mt-1 font-semibold text-white">
              {plan.name}
            </p>
          </div>
        )}
      </div>

      <CoachChat />

    </div>
  );
}