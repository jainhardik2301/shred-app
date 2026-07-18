import OverallProgressScore from "./OverallProgressScore";
import ProgressStreak from "./ProgressStreak";
import GoalStatus from "./GoalStatus";

export default function ProgressMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">

      <OverallProgressScore />

      <ProgressStreak />

      <GoalStatus />

    </div>
  );
}