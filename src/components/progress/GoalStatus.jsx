import { useApp } from "../../contexts/AppContext";
import SectionCard from "../ui/SectionCard";
import MetricRow from "../ui/MetricRow";

export default function GoalStatus() {
  const { appData } = useApp();

  if (!appData.profile) return null;

  const current = appData.profile.weight;
  const target = appData.goals.targetWeight;
  const remaining = Math.abs(current - target).toFixed(1);

  return (
    <SectionCard title="Goal Status">

      <MetricRow
        label="Current Weight"
        value={`${current} kg`}
      />

      <MetricRow
        label="Target Weight"
        value={`${target} kg`}
      />

      <MetricRow
        label="Remaining"
        value={`${remaining} kg`}
        color="text-emerald-400"
      />

    </SectionCard>
  );
}