import WeightUpdateCard from "./WeightUpdateCard";
import GoalProgressCard from "./GoalProgressCard";
import BMICard from "./BMICard";

export default function ProgressOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">

      <WeightUpdateCard />

      <GoalProgressCard />

      <BMICard />

    </div>
  );
}