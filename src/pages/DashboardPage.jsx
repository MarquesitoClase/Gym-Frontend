import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { DashboardOverview } from "../features/dashboard/DashboardOverview";

export function DashboardPage() {
  return (
    <PageContainer>
      <SectionHeader
        actions={
          <>
            <Button disabled iconLeft={<Icon name="spark" size={16} />} variant="secondary">
              Resumen diario
            </Button>
            <Button disabled iconLeft={<Icon name="plus" size={16} />}>
              Abrir inscripciones
            </Button>
          </>
        }
        description="Vision operativa del gimnasio construida con usuarios, profesores y actividades reales del backend."
        eyebrow="Titan Gym"
        title="Panel principal"
      />

      <DashboardOverview />
    </PageContainer>
  );
}
