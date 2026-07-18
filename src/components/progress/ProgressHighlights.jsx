import DailyConsistency from "./DailyConsistency";
import OverallProgressScore from "./OverallProgressScore";
import ProgressStreak from "./ProgressStreak";

export default function ProgressHighlights() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">

      <OverallProgressScore />

      <DailyConsistency />

      <ProgressStreak />

    </div>
  );
}