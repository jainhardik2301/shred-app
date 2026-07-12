import ProgressBar from "./ProgressBar";
import { useApp } from "../../contexts/AppContext";

export default function TodayProgress() {
  const { appData } = useApp();

  if (!appData.goals || !appData.today) {
    return null;
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
      <h2 className="mb-8 text-2xl font-bold">
        Today's Progress
      </h2>

      <ProgressBar
        title="Calories"
        value={appData.today.calories}
        goal={appData.goals.calories}
        unit="kcal"
        color="bg-orange-500"
      />

      <ProgressBar
        title="Protein"
        value={appData.today.protein}
        goal={appData.goals.protein}
        unit="g"
        color="bg-emerald-500"
      />

      <ProgressBar
        title="Water"
        value={appData.today.water}
        goal={appData.goals.water}
        unit="L"
        color="bg-sky-500"
      />

      <ProgressBar
        title="Steps"
        value={appData.today.steps}
        goal={appData.goals.stepGoal}
        color="bg-violet-500"
      />

      <ProgressBar
        title="Sleep"
        value={appData.today.sleep}
        goal={8}
        unit="hrs"
        color="bg-purple-500"
      />
    </div>
  );
}