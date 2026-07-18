import WeightUpdateCard from "./WeightUpdateCard";
import GoalProgressCard from "./GoalProgressCard";
import BMICard from "./BMICard";
import OverallProgressScore from "./OverallProgressScore";
import MonthlySummary from "./MonthlySummary";
import WeightHistory from "./WeightHistory";
import HealthTrends from "./HealthTrends";

export default function ProgressDashboard() {
  return (
    <div className="space-y-8">

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <WeightUpdateCard />
        <GoalProgressCard />
        <BMICard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <OverallProgressScore />
        <MonthlySummary />
      </div>

      <WeightHistory />

      <HealthTrends />

    </div>
  );
}