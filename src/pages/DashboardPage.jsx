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
            <Button iconLeft={<Icon name="spark" size={16} />} variant="secondary">
              Resumen diario
            </Button>
            <Button iconLeft={<Icon name="plus" size={16} />}>
              Abrir inscripciones
            </Button>
          </>
        }
        description="Visión operativa del gimnasio con foco en recepción, actividad diaria e integración futura."
        eyebrow="Titan Gym"
        title="Panel principal"
      />

      <DashboardOverview />
    </PageContainer>
  );
}
