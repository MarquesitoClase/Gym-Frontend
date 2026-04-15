import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { SectionHeader } from "../components/ui/SectionHeader";
import { ActivityCatalog } from "../features/activities/ActivityCatalog";
import { ActivityFormModal } from "../features/activities/ActivityFormModal";

export function ActivitiesPage() {
  const [editorState, setEditorState] = useState({
    activityId: null,
    mode: null
  });
  const [refreshToken, setRefreshToken] = useState(0);

  const openCreateModal = () => {
    setEditorState({
      activityId: null,
      mode: "create"
    });
  };

  const openEditModal = (activityId) => {
    setEditorState({
      activityId,
      mode: "edit"
    });
  };

  const closeModal = () => {
    setEditorState({
      activityId: null,
      mode: null
    });
  };

  const handleFormSuccess = () => {
    closeModal();
    setRefreshToken((currentValue) => currentValue + 1);
  };

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
            <Button iconLeft={<Icon name="plus" size={16} />} onClick={openCreateModal}>
              Nueva actividad
            </Button>
          </>
        }
        description="Consulta el catalogo futuro real del backend y prepara la siguiente fase de CRUD."
        eyebrow="Catalogo"
        title="Actividades"
      />

      <ActivityCatalog
        onCreateRequest={openCreateModal}
        onEditRequest={openEditModal}
        refreshToken={refreshToken}
      />

      {editorState.mode ? (
        <ActivityFormModal
          activityId={editorState.activityId}
          mode={editorState.mode}
          onClose={closeModal}
          onSuccess={handleFormSuccess}
        />
      ) : null}
    </PageContainer>
  );
}
