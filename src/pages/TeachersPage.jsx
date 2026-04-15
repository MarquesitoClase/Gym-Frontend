import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { TeachersTableSection } from "../features/teachers/TeachersTableSection";

export function TeachersPage() {
  return (
    <PageContainer>
      <SectionHeader
        actions={
          <>
            <Button iconLeft={<Icon name="teachers" size={16} />} variant="secondary">
              Estado docente
            </Button>
            <Button iconLeft={<Icon name="plus" size={16} />}>
              Nuevo profesor
            </Button>
          </>
        }
        description="Estructura inicial para disponibilidad, asignaciones y control de actividad del equipo."
        eyebrow="Equipo"
        title="Profesores"
      />

      <TeachersTableSection />
    </PageContainer>
  );
}
