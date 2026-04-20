import { PageContainer } from "../components/PageContainer/PageContainer";
import { PageHeader } from "../components/PageHeader/PageHeader";
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
