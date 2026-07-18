import WorkoutDashboard from "../../components/workout/WorkoutDashboard";
import PageLayout from "../../components/ui/PageLayout";

export default function Workout() {
  return (
    <PageLayout
      title="Workout Planner"
      subtitle="Plan, track and complete your workouts."
    >
      <WorkoutDashboard />
    </PageLayout>
  );
}