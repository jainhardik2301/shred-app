import PageLayout from "../../components/ui/PageLayout";
import ProgressDashboard from "../../components/progress/ProgressDashboard";

export default function Progress() {
  return (
    <PageLayout
      title="Progress"
      subtitle="Track your transformation over time."
    >

      <ProgressDashboard />

    </PageLayout>
  );
}