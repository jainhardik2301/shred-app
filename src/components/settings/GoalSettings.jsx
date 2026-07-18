import {
  useEffect,
  useState,
} from "react";

import { useApp } from "../../contexts/AppContext";

import {
  weightToDisplay,
  weightToStorage,
} from "../../utils/unitConversions";

export default function GoalSettings() {
  const {
    appData,
    setAppData,
  } = useApp();

  const weightUnit =
    appData?.preferences?.weightUnit ||
    "kg";

  const [goals, setGoals] =
    useState({
      calories: "",
      protein: "",
      water: "",
      steps: "",
      targetWeight: "",
      targetDate: "",
    });

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    const storedTargetWeight =
      appData?.goals?.targetWeight;

    setGoals({
      calories:
        appData?.goals?.calories ||
        "",

      protein:
        appData?.goals?.protein ||
        "",

      water:
        appData?.goals?.water ||
        "",

      steps:
        appData?.goals?.steps ||
        "",

      targetWeight:
        storedTargetWeight
          ? weightToDisplay(
              storedTargetWeight,
              weightUnit
            )
          : "",

      targetDate:
        appData?.goals?.targetDate ||
        "",
    });
  }, [
    appData?.goals,
    weightUnit,
  ]);

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setGoals((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();

    const storedTargetWeight =
      goals.targetWeight === ""
        ? 0
        : weightToStorage(
            goals.targetWeight,
            weightUnit
          );

    setAppData((prev) => ({
      ...prev,

      goals: {
        ...(prev.goals || {}),

        calories:
          Number(
            goals.calories
          ) || 0,

        protein:
          Number(
            goals.protein
          ) || 0,

        water:
          Number(
            goals.water
          ) || 0,

        steps:
          Number(
            goals.steps
          ) || 0,

        targetWeight:
          storedTargetWeight,

        targetDate:
          goals.targetDate,
      },
    }));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div>
        <h2 className="text-2xl font-bold">
          Goals
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Set your daily and long-term targets.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <GoalField
          label="Daily Calories"
          name="calories"
          value={goals.calories}
          onChange={handleChange}
          unit="kcal"
        />

        <GoalField
          label="Daily Protein"
          name="protein"
          value={goals.protein}
          onChange={handleChange}
          unit="g"
        />

        <GoalField
          label="Daily Water"
          name="water"
          value={goals.water}
          onChange={handleChange}
          unit="L"
          step="0.1"
        />

        <GoalField
          label="Daily Steps"
          name="steps"
          value={goals.steps}
          onChange={handleChange}
          unit="steps"
        />

        <GoalField
          label="Target Weight"
          name="targetWeight"
          value={
            goals.targetWeight
          }
          onChange={handleChange}
          unit={weightUnit}
          step="0.1"
        />

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Target Date
          </label>

          <input
            type="date"
            name="targetDate"
            value={
              goals.targetDate
            }
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          Save Goals
        </button>

        {saved && (
          <span className="text-sm text-emerald-400">
            Goals saved
          </span>
        )}
      </div>
    </form>
  );
}

function GoalField({
  label,
  name,
  value,
  onChange,
  unit,
  step = "1",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          min="0"
          step={step}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-20 outline-none focus:border-emerald-500"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
          {unit}
        </span>
      </div>
    </div>
  );
}