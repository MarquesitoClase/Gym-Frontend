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
            <Button
              disabled
              iconLeft={<Icon name="search" size={16} />}
              variant="secondary"
            >
              Filtrar
            </Button>
            <Button disabled iconLeft={<Icon name="plus" size={16} />}>
              Nueva actividad
            </Button>
          </>
        }
        description="Consulta el catalogo futuro real del backend y prepara la siguiente fase de CRUD."
        eyebrow="Catalogo"
        title="Actividades"
      />

      <ActivityCatalog />
    </PageContainer>
  );
}
