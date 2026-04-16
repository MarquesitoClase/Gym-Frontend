import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { EnrollmentWorkspace } from "../features/enrollments/EnrollmentWorkspace";

export function EnrollmentsPage() {
  return (
    <PageContainer>
      <PageHeader
        description="Busca un socio, elige una actividad y confirma la inscripcion en segundos."
        title="Inscripcion rapida"
      />
      <EnrollmentWorkspace />
    </PageContainer>
  );
}
