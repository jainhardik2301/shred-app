import { useApp } from "../../contexts/AppContext";

export default function NutritionInsights() {
  const { appData } = useApp();

  const calories =
    Number(appData?.today?.calories) || 0;

  const protein =
    Number(appData?.today?.protein) || 0;

  const water =
    Number(appData?.today?.water) || 0;

  const calorieGoal =
    Number(appData?.goals?.calories) || 0;

  const proteinGoal =
    Number(appData?.goals?.protein) || 0;

  const waterGoal =
    Number(appData?.goals?.water) || 0;

  function getProgress(current, goal) {
    if (!goal || goal <= 0) return 0;

    return Math.min(
      100,
      Math.max(0, (current / goal) * 100)
    );
  }

  const calorieProgress =
    getProgress(calories, calorieGoal);

  const proteinProgress =
    getProgress(protein, proteinGoal);

  const waterProgress =
    getProgress(water, waterGoal);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold text-white">
  Daily Nutrition Insights
</h3>

      <div className="mt-8 space-y-8">

        <ProgressBar
          label="Calories"
          value={calories}
          goal={calorieGoal}
          unit="kcal"
          progress={calorieProgress}
        />

        <ProgressBar
          label="Protein"
          value={protein}
          goal={proteinGoal}
          unit="g"
          progress={proteinProgress}
        />

        <ProgressBar
          label="Water"
          value={water}
          goal={waterGoal}
          unit="L"
          progress={waterProgress}
        />

      </div>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  goal,
  unit,
  progress,
}) {
  return (
    <div>
      <div className="mb-3 flex justify-between">
        <span>
          {label}
        </span>

        <span className="text-slate-400">
          {value} / {goal || "-"} {unit}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}