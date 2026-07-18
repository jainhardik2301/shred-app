import { useApp } from "../../contexts/AppContext";
import ProgressCard from "../ui/ProgressCard";

export default function DailyConsistency() {
  const { appData } = useApp();

  const calories =
    appData.goals.calories > 0
      ? (appData.today.calories /
          appData.goals.calories) *
        100
      : 0;

  const protein =
    appData.goals.protein > 0
      ? (appData.today.protein /
          appData.goals.protein) *
        100
      : 0;

  const water =
    appData.goals.water > 0
      ? (appData.today.water /
          appData.goals.water) *
        100
      : 0;

  const consistency = Math.round(
    (calories + protein + water) / 3
  );

  return (
    <ProgressCard
      title="Daily Consistency"
      value={`${consistency}%`}
      subtitle="Based on today's habits"
      progress={consistency}
      color="bg-cyan-500"
    />
  );
}