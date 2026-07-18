import DashboardSummary from "./DashboardSummary";
import GoalCompletion from "./GoalCompletion";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">

      <DashboardSummary />

      <GoalCompletion />

    </div>
  );
}