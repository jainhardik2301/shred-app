import HabitsDashboard from "../../components/habits/HabitsDashboard";
import PageLayout from "../../components/ui/PageLayout";

export default function Habits() {
  return (
    <div className="text-white">

      <PageLayout
        title="Daily Habits"
        subtitle="Build consistency one day at a time."
      >
        <HabitsDashboard />
      </PageLayout>

    </div>
  );
}