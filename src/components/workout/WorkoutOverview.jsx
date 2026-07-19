import { useApp } from "../../contexts/AppContext";
import WorkoutStatsCard from "./WorkoutStatsCard";

export default function WorkoutOverview() {
  const { appData } = useApp();

  const workoutHistory =
    appData?.workoutHistory || [];

  const workoutPlans =
    appData?.workoutPlans || [];

  // ---------------------------------
  // START OF CURRENT WEEK - MONDAY
  // ---------------------------------

  const now = new Date();

  const startOfWeek =
    new Date(now);

  const day =
    startOfWeek.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  startOfWeek.setDate(
    startOfWeek.getDate() + diff
  );

  startOfWeek.setHours(
    0,
    0,
    0,
    0
  );

  // ---------------------------------
  // COMPLETED WORKOUTS THIS WEEK
  // ---------------------------------

  const thisWeekWorkouts =
    workoutHistory.filter(
      (workout) => {
        if (
          !workout.completedAt
        ) {
          return false;
        }

        const completedDate =
          new Date(
            workout.completedAt
          );

        return (
          completedDate >=
          startOfWeek
        );
      }
    );

  const workoutsCompleted =
    thisWeekWorkouts.length;

  // ---------------------------------
  // CALORIES THIS WEEK
  // ---------------------------------

  const caloriesBurned =
    thisWeekWorkouts.reduce(
      (total, workout) =>
        total +
        (
          Number(
            workout.calories
          ) || 0
        ),
      0
    );

  // ---------------------------------
  // ACTIVE PLAN
  // ---------------------------------

  const activePlan =
    workoutPlans.find(
      (plan) =>
        plan.isActive
    ) || null;

  // ---------------------------------
  // SCHEDULED WORKOUT DAYS
  // ---------------------------------

  const scheduledWorkoutDays =
    activePlan?.days?.filter(
      (day) =>
        !day.isRestDay
    ).length || 0;

  // ---------------------------------
  // WEEKLY COMPLETION
  // ---------------------------------

  const completion =
    scheduledWorkoutDays > 0
      ? Math.min(
          100,
          Math.round(
            (
              workoutsCompleted /
              scheduledWorkoutDays
            ) * 100
          )
        )
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">

      <WorkoutStatsCard
        title="This Week"
        value={
          workoutsCompleted
        }
        subtitle="Workouts"
        color="text-emerald-400"
      />

      <WorkoutStatsCard
        title="Calories Burned"
        value={
          caloriesBurned
        }
        subtitle="kcal"
        color="text-orange-400"
      />

      <WorkoutStatsCard
        title="Completion"
        value={`${completion}%`}
        subtitle="Weekly Goal"
        color="text-sky-400"
      />

    </div>
  );
}