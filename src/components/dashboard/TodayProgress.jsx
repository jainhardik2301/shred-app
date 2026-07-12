import ProgressBar from "./ProgressBar";
import user from "../../data/user";

export default function TodayProgress() {
  return (
    <div className="rounded-2xl bg-slate-900 p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">
        Today's Progress
      </h2>

      <ProgressBar
        title="Calories"
        value={user.today.calories}
        goal={user.goals.targetCalories}
        unit="kcal"
        color="bg-orange-500"
      />

      <ProgressBar
        title="Protein"
        value={user.today.protein}
        goal={user.goals.targetProtein}
        unit="g"
        color="bg-emerald-500"
      />

      <ProgressBar
        title="Water"
        value={user.today.water}
        goal={user.goals.targetWater}
        unit="L"
        color="bg-sky-500"
      />

      <ProgressBar
        title="Steps"
        value={user.today.steps}
        goal={user.goals.targetSteps}
        color="bg-violet-500"
      />

      <ProgressBar
        title="Sleep"
        value={user.today.sleep}
        goal={user.goals.targetsleep}
        color="bg-violet-500"
      />
    </div>
  );
}