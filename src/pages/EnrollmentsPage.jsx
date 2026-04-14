import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { EnrollmentWorkspace } from "../features/enrollments/EnrollmentWorkspace";

export function EnrollmentsPage() {
  return (
    <PageContainer>
      <SectionHeader
        actions={
          <>
            <Button iconLeft={<Icon name="clock" size={16} />} variant="secondary">
              Historial
            </Button>
            <Button iconLeft={<Icon name="plus" size={16} />}>
              Nueva inscripción
            </Button>
          </>
        }
        description="Panel de trabajo orientado a rapidez de operación y listo para validar reglas de negocio desde backend."
        eyebrow="Recepción"
        title="Inscripciones"
      />

      <EnrollmentWorkspace />
    </PageContainer>
  );
}
