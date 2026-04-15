import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { ActivityCatalog } from "../features/activities/ActivityCatalog";

export function ActivitiesPage() {
  return (
    <PageContainer>
      <SectionHeader
        actions={
          <>
            <Button iconLeft={<Icon name="search" size={16} />} variant="secondary">
              Filtrar
            </Button>
            <Button iconLeft={<Icon name="plus" size={16} />}>
              Nueva actividad
            </Button>
          </>
        }
        description="Gestiona el catálogo, revisa horarios y prepara el flujo para futuras operaciones CRUD."
        eyebrow="Catálogo"
        title="Actividades"
      />

      <ActivityCatalog />
    </PageContainer>
  );
}
