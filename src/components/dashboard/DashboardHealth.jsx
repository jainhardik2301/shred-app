import HealthScoreCard from "./HealthScoreCard";
import NutritionInsights from "../nutrition/NutritionInsights";

export default function DashboardHealth() {
  return (
    <div className="grid grid-cols-2 gap-6">

      <HealthScoreCard />

      <NutritionInsights />

    </div>
  );
}