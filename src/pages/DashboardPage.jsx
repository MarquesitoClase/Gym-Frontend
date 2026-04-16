import { PageContainer } from "../components/ui/PageContainer";
import { DashboardOverview } from "../features/dashboard/DashboardOverview";

export function DashboardPage() {
  return (
    <PageContainer className="dashboard-page">
      <DashboardOverview />
    </PageContainer>
  );
}
