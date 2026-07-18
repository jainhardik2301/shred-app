import WorkoutStatsCard from "./WorkoutStatsCard";

export default function WorkoutOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      <WorkoutStatsCard
        title="This Week"
        value="4"
        subtitle="Workouts"
        color="text-emerald-400"
      />

      <WorkoutStatsCard
        title="Calories Burned"
        value="1850"
        subtitle="kcal"
        color="text-orange-400"
      />

      <WorkoutStatsCard
        title="Completion"
        value="82%"
        subtitle="Weekly Goal"
        color="text-sky-400"
      />

    </div>
  );
}