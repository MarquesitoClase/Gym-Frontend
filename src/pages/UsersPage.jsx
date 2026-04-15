import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { UsersTableSection } from "../features/users/UsersTableSection";

export function UsersPage() {
  return (
    <PageContainer>
      <PageHeader
        breadcrumb={["Admin", "Usuarios"]}
        title="Usuarios"
        description="Gestiona altas, estado y renovaciones de socios."
        actions={
          <Button iconLeft={<Icon name="plus" size={16} />}>
            Nuevo usuario
          </Button>
        }
      />

      <UsersTableSection />
    </PageContainer>
  );
}