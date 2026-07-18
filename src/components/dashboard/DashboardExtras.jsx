import WaterTracker from "./WaterTracker";
import DailyStreak from "./DailyStreak";

export default function DashboardExtras() {
  return (
    <div className="grid grid-cols-2 gap-6">

      <WaterTracker />

      <DailyStreak />

    </div>
  );
}