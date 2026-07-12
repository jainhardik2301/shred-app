import StatCard from "../../components/ui/StatCard";
import HealthScoreCard from "../../components/dashboard/HealthScoreCard";
import user from "../../data/user";
import TodayProgress from "../../components/dashboard/TodayProgress";
import TodayChecklist from "../../components/dashboard/TodayChecklist";
import WeightChart from "../../components/dashboard/charts/WeightChart";

export default function Dashboard() {
  return (
    <div>   
      <h1 className="mb-8 text-4xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <HealthScoreCard />

        <StatCard
          title="Weight"
          value={`${user.profile.currentWeight} kg`}
          subtitle="Current Weight"
        />

        <StatCard
          title="Protein"
          value={`${user.today.protein} g`}
          subtitle={`Goal ${user.goals.targetProtein} g`}
          color="text-emerald-400"
        />

        <StatCard
          title="Water"
          value={`${user.today.water} L`}
          subtitle={`Goal ${user.goals.targetWater} L`}
          color="text-sky-400"
        />
      </div>
      <TodayProgress />
      <TodayChecklist />
      <WeightChart />
    </div>
    
  );
}