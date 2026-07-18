import WorkoutOverview from "./WorkoutOverview";
import TodaysWorkout from "./TodaysWorkout";
import WorkoutSessionCard from "./WorkoutSessionCard";
import WorkoutHistory from "./WorkoutHistory";

import ExerciseLibrary from "../exerciseLibrary/ExerciseLibrary";
import WorkoutBuilder from "../workoutBuilder/WorkoutBuilder";

export default function WorkoutDashboard() {
  return (
    <div className="space-y-8">

      <WorkoutOverview />

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">
          <TodaysWorkout />
        </div>

        <WorkoutSessionCard />

      </div>

      <WorkoutHistory />

      <WorkoutBuilder />

      <ExerciseLibrary />

    </div>
  );
}