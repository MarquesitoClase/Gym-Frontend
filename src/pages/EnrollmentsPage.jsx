import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { EnrollmentWorkspace } from "../features/enrollments/EnrollmentWorkspace";

export function EnrollmentsPage() {
  return (
    <PageContainer>
      <PageHeader
        description="Paso 2 de 2: confirma actividad y validaciones operativas antes de inscribir."
        title="Panel de inscripciones"
      />

      <EnrollmentWorkspace />
    </PageContainer>
  );
}
