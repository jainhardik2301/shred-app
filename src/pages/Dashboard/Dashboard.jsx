import StatCard from "../../components/ui/StatCard";
import HealthScoreCard from "../../components/dashboard/HealthScoreCard";
import TodayProgress from "../../components/dashboard/TodayProgress";
import TodayChecklist from "../../components/dashboard/TodayChecklist";
import WeightChart from "../../components/dashboard/charts/WeightChart";
import { useApp } from "../../contexts/AppContext";

export default function Dashboard() {
  const { appData } = useApp();

  if (!appData.profile || !appData.goals) {
    return (
      <div className="p-10 text-white">
        No profile found. Please complete onboarding.
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">
        Dashboard
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-6">

        <HealthScoreCard />

        <StatCard
          title="Weight"
          value={`${appData.profile.weight} kg`}
          subtitle="Current Weight"
        />

        <StatCard
          title="Protein"
          value={`${appData.goals.protein} g`}
          subtitle={`Daily Target`}
          color="text-emerald-400"
        />

        <StatCard
          title="Water"
          value={`${appData.goals.water} L`}
          subtitle="Daily Target"
          color="text-sky-400"
        />

      </div>

      <TodayProgress />

      <TodayChecklist />

      <WeightChart />
    </div>
  );
}