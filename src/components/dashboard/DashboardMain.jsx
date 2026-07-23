import DashboardOverview from "./DashboardOverview";
import DashboardHealth from "./DashboardHealth";
import DashboardActivity from "./DashboardActivity";
import DashboardCharts from "./DashboardCharts";
import DashboardExtras from "./DashboardExtras";
import DashboardStats from "./DashboardStats";
import DashboardBottom from "./DashboardBottom";
import QuickActions from "./QuickActions";
import DashboardTodayPlan from "./DashboardTodayPlan";

export default function DashboardMain() {
  return (
    <div className="space-y-8">

      <DashboardOverview />

      <DashboardTodayPlan />

      <DashboardHealth />

      <DashboardActivity />

      <DashboardCharts />

      <DashboardExtras />

      <DashboardStats />

      <DashboardBottom />

      <QuickActions />

    </div>
  );
}