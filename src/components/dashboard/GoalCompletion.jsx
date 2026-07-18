import { useApp } from "../../contexts/AppContext";
import ProgressRing from "../ui/ProgressRing";

export default function GoalCompletion() {
  const { appData } = useApp();

  if (!appData?.profile) return null;

  const calories =
    Number(appData?.today?.calories) || 0;

  const calorieGoal =
    Number(appData?.goals?.calories) || 0;

  const score =
    calorieGoal > 0
      ? Math.round(
          (calories / calorieGoal) * 100
        )
      : 0;

  const safeScore = Math.max(
    0,
    Math.min(
      Number.isFinite(score) ? score : 0,
      100
    )
  );

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white">
      <h2 className="mb-8 text-2xl font-bold text-white">
        Goal Completion
      </h2>

      <div className="flex justify-center">
        <ProgressRing value={safeScore} />
      </div>
    </div>
  );
}