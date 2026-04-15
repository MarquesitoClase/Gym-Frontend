import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { EnrollmentWorkspace } from "../features/enrollments/EnrollmentWorkspace";

export function EnrollmentsPage() {
  return (
    <PageContainer>
      <SectionHeader
        description="Selecciona un usuario, consulta sus actividades futuras y confirma la inscripcion contra el backend real."
        eyebrow="Recepcion"
        title="Inscripciones"
      />

      <EnrollmentWorkspace />
    </PageContainer>
  );
}
