import { useApp } from "../../contexts/AppContext";

export default function TodayGoals() {
  const { appData } = useApp();

  const today = appData?.today || {};
  const goals = appData?.goals || {};

  const items = [
    {
      label: "Calories",
      current: Number(today.calories) || 0,
      target: Number(goals.calories) || 0,
      unit: "kcal",
    },
    {
      label: "Protein",
      current: Number(today.protein) || 0,
      target: Number(goals.protein) || 0,
      unit: "g",
    },
    {
      label: "Water",
      current: Number(today.water) || 0,
      target: Number(goals.water) || 0,
      unit: "L",
    },
    {
      label: "Steps",
      current: Number(today.steps) || 0,
      target:
        Number(goals.steps) ||
        Number(goals.stepGoal) ||
        10000,
      unit: "",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        Today's Goals
      </h2>

      <div className="space-y-5">
        {items.map((goal) => (
          <div
            key={goal.label}
            className="flex items-center justify-between"
          >
            <span className="text-slate-400">
              {goal.label}
            </span>

            <span className="font-semibold">
              {goal.current} / {goal.target} {goal.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}