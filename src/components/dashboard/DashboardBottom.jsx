import WeeklyProgress from "./WeeklyProgress";
import MotivationCard from "./MotivationCard";

export default function DashboardBottom() {
  return (
    <div className="grid grid-cols-2 gap-6">

      <WeeklyProgress />

      <MotivationCard />

    </div>
  );
}