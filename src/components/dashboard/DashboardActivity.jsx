import TodayProgress from "./TodayProgress";
import TodayChecklist from "./TodayChecklist";

export default function DashboardActivity() {
  return (
    <div className="space-y-8">

      <TodayProgress />

      <TodayChecklist />

    </div>
  );
}