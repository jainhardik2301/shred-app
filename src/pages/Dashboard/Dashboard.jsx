import { useApp } from "../../contexts/AppContext";
import PageLayout from "../../components/ui/PageLayout";
import DashboardMain from "../../components/dashboard/DashboardMain";
import DashboardFooter from "../../components/dashboard/DashboardFooter";
import EmptyState from "../../components/ui/EmptyState";

export default function Dashboard() {
  const { appData } = useApp();

  if (!appData.profile) {
    return (
      <EmptyState
        title="No Profile Found"
        subtitle="Complete onboarding to start using SHRED."
      />
    );
  }

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your health overview."
    >

      <DashboardMain />

      <DashboardFooter />

    </PageLayout>
  );
}