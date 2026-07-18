import WeightProgressCard from "./WeightProgressCard";
import BMICard from "./BMICard";
import GoalProgressCard from "./GoalProgressCard";

export default function ProgressStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">

      <WeightProgressCard />

      <BMICard />

      <GoalProgressCard />

    </div>
  );
}