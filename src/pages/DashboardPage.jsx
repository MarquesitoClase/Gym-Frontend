import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { DashboardOverview } from "../features/dashboard/DashboardOverview";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <SectionHeader
        actions={
          <Button
            iconLeft={<Icon name="plus" size={16} />}
            onClick={() => navigate("/inscripciones")}
          >
            Abrir inscripciones
          </Button>
        }
        description="Vision operativa del gimnasio construida con datos reales de usuarios, profesores y actividades."
        eyebrow="Titan Gym"
        title="Panel principal"
      />

      <DashboardOverview />
    </PageContainer>
  );
}
