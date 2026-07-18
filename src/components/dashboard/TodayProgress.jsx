import ProgressBar from "./ProgressBar";
import { useApp } from "../../contexts/AppContext";

export default function TodayProgress() {
  const { appData } = useApp();

  if (!appData?.profile) return null;

  const today = appData?.today || {};
  const goals = appData?.goals || {};

  const stepsGoal =
    Number(goals.steps) ||
    Number(goals.stepGoal) ||
    10000;

  return (
    <div className="mt-8 rounded-2xl bg-slate-900 p-8">
      <h2 className="mb-8 text-2xl font-bold">
        Today's Progress
      </h2>

      <ProgressBar
        title="Calories"
        value={Number(today.calories) || 0}
        goal={Number(goals.calories) || 1}
        unit="kcal"
        color="bg-orange-500"
      />

      <ProgressBar
        title="Protein"
        value={Number(today.protein) || 0}
        goal={Number(goals.protein) || 1}
        unit="g"
        color="bg-emerald-500"
      />

      <ProgressBar
        title="Water"
        value={Number(today.water) || 0}
        goal={Number(goals.water) || 1}
        unit="L"
        color="bg-sky-500"
      />

      <ProgressBar
        title="Steps"
        value={Number(today.steps) || 0}
        goal={stepsGoal}
        color="bg-violet-500"
      />

      <ProgressBar
        title="Sleep"
        value={Number(today.sleep) || 0}
        goal={8}
        unit="hrs"
        color="bg-indigo-500"
      />
    </div>
  );
}