import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { TeachersTableSection } from "../features/teachers/TeachersTableSection";

export function TeachersPage() {
  return (
    <PageContainer>
      <PageHeader
        actions={
          <Button iconLeft={<Icon name="plus" size={16} />}>
            Nuevo profesor
          </Button>
        }
        breadcrumb={["Admin", "Profesores"]}
        description="Controla disponibilidad, certificaciones y asignaciones del equipo docente."
        title="Profesores"
      />

      <TeachersTableSection />
    </PageContainer>
  );
}
