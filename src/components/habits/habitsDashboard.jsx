import DailyHabitScore from "./DailyHabitScore";
import WaterCard from "./WaterCard";
import StepsCard from "./StepsCard";
import SleepCard from "./SleepCard";
import HabitProgress from "./HabitProgress";
import HabitStreakCard from "./HabitStreakCard";
import HabitTips from "./HabitTips";

export default function HabitsDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Daily Habits
        </h1>

        <p className="mt-2 text-slate-400">
          Build consistency one day at a time.
        </p>
      </div>

      <DailyHabitScore />

      <div className="grid gap-6 md:grid-cols-3">
        <WaterCard />
        <StepsCard />
        <SleepCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <HabitProgress />
        <HabitStreakCard />
      </div>

      <HabitTips />
    </div>
  );
}