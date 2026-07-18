import { useApp } from "../../contexts/AppContext";
import SectionCard from "../ui/SectionCard";
import MetricRow from "../ui/MetricRow";

export default function GoalTimeline() {
  const { appData } = useApp();

  return (
    <SectionCard title="Goal Timeline">

      <MetricRow
        label="Start Date"
        value={new Date().toLocaleDateString("en-IN")}
      />

      <MetricRow
        label="Target Date"
        value={appData.goals.targetDate || "--"}
      />

      <MetricRow
        label="Target Weight"
        value={`${appData.goals.targetWeight} kg`}
      />

    </SectionCard>
  );
}