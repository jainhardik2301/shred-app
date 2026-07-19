import { useState } from "react";
import { useApp } from "../../contexts/AppContext";

export default function DataSettings() {
  const { setAppData } = useApp();

  const [message, setMessage] =
    useState("");

  function resetToday() {
    const confirmed = window.confirm(
      "Reset today's nutrition and habit tracking data?"
    );

    if (!confirmed) return;

    setAppData((prev) => ({
      ...prev,

      today: {
        ...(prev.today || {}),

        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
        steps: 0,
        sleep: 0,
      },

      meals: [],
    }));

    setMessage(
      "Today's tracking data has been reset."
    );
  }

  function resetAllData() {
    const confirmed = window.confirm(
      "This will reset your SHRED data, including profile, goals, meals, progress and custom workout data. Continue?"
    );

    if (!confirmed) return;

    const secondConfirmation =
      window.confirm(
        "Are you sure? This action cannot be undone."
      );

    if (!secondConfirmation) return;

    const resetData = {
      profile: {},

      activeSchedule: {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      },

      goals: {
        calories: 0,
        protein: 0,
        water: 0,
        steps: 0,
        targetWeight: 0,
        targetDate: "",
      },

      today: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0,
        steps: 0,
        sleep: 0,
      },

      history: {
        weight: [],
      },

      meals: [],

      workoutPlans: [],

      workoutHistory: [],

      habitHistory: {},

      preferences: {
        weightUnit: "kg",
        heightUnit: "cm",
      },
    };

    setAppData(resetData);

    setMessage(
      "SHRED data has been reset."
    );
  }

  return (
    <div className="rounded-2xl border border-red-900/50 bg-slate-900 p-6">

      <div>
        <h2 className="text-2xl font-bold">
          Data Management
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Manage or reset your stored SHRED data.
        </p>
      </div>

      <div className="mt-6 space-y-4">

        <div className="flex flex-col justify-between gap-4 rounded-xl bg-slate-800 p-5 md:flex-row md:items-center">

          <div>
            <h3 className="font-semibold">
              Reset Today's Data
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Clears today's meals, nutrition,
              water, steps and sleep.
            </p>
          </div>

          <button
            type="button"
            onClick={resetToday}
            className="rounded-xl border border-orange-700 px-5 py-2.5 font-semibold text-orange-400 transition hover:bg-orange-500/10"
          >
            Reset Today
          </button>

        </div>

        <div className="flex flex-col justify-between gap-4 rounded-xl border border-red-900/50 bg-red-950/20 p-5 md:flex-row md:items-center">

          <div>
            <h3 className="font-semibold text-red-400">
              Reset All SHRED Data
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Clears your profile, goals, progress,
              meals and custom workout data.
            </p>
          </div>

          <button
            type="button"
            onClick={resetAllData}
            className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600"
          >
            Reset Everything
          </button>

        </div>

      </div>

      {message && (
        <p className="mt-5 text-sm text-emerald-400">
          {message}
        </p>
      )}

    </div>
  );
}