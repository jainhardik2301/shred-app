import TodayGoals from "./TodayGoals";
import BodyMetrics from "./BodyMetrics";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-6">

      <TodayGoals />

      <BodyMetrics />

    </div>
  );
}