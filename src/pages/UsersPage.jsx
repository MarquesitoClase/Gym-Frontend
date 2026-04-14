import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { UsersTableSection } from "../features/users/UsersTableSection";

export function UsersPage() {
  return (
    <PageContainer>
      <SectionHeader
        actions={
          <>
            <Button iconLeft={<Icon name="users" size={16} />} variant="secondary">
              Usuarios activos
            </Button>
            <Button iconLeft={<Icon name="plus" size={16} />}>
              Nuevo usuario
            </Button>
          </>
        }
        description="Base preparada para listados, filtros y futuras acciones de gestión de socios."
        eyebrow="Recepción"
        title="Usuarios"
      />

      <UsersTableSection />
    </PageContainer>
  );
}
