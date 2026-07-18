import { useApp } from "../../contexts/AppContext";
import ResponsiveGrid from "../ui/ResponsiveGrid";
import InfoCard from "../ui/InfoCard";
import {
  formatWeight,
} from "../../utils/unitConversions";

export default function DashboardSummary() {
  const { appData } = useApp();

  if (!appData.profile) return null;

  const weightUnit =
    appData?.preferences?.weightUnit || "kg";

  return (
    <ResponsiveGrid cols={4}>
      <InfoCard
        title="Current Weight"
        value={formatWeight(
          appData.profile.weight,
          weightUnit
        )}
        subtitle="Latest"
      />

      <InfoCard
        title="Calories"
        value={appData.today.calories}
        subtitle={`Goal ${appData.goals.calories}`}
        color="text-orange-400"
      />

      <InfoCard
        title="Protein"
        value={`${appData.today.protein} g`}
        subtitle={`Goal ${appData.goals.protein} g`}
        color="text-emerald-400"
      />

      <InfoCard
        title="Water"
        value={`${appData.today.water} L`}
        subtitle={`Goal ${appData.goals.water} L`}
        color="text-sky-400"
      />
    </ResponsiveGrid>
  );
}