import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { PageContainer } from "../components/PageContainer/PageContainer";

export function NotFoundPage() {
  return (
    <PageContainer className="not-found-page">
      <EmptyState
        action={
          <Link className="button button--primary button--md" to="/">
            Volver al panel
          </Link>
        }
        description="La ruta solicitada no existe dentro del panel interno de TenFit."
        title="No hemos encontrado esta vista"
      />
    </PageContainer>
  );
}
