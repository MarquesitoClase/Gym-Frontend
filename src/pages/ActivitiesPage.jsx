import { useState } from "react";
import { Button } from "../components/Button/Button";
import { Icon } from "../components/Icon/Icon";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { ActivityCatalog } from "../features/activities/ActivityCatalog";
import { ActivityFormModal } from "../features/activities/ActivityFormModal";
import { ClassRosterModal } from "../features/activities/ClassRosterModal";

export function ActivitiesPage() {
  const [editorState, setEditorState] = useState({
    activityId: null,
    mode: null
  });
  const [rosterActivityId, setRosterActivityId] = useState(null);
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

  const openRosterModal = (activityId) => {
    setRosterActivityId(activityId);
  };

  const closeRosterModal = () => {
    setRosterActivityId(null);
    setRefreshToken((currentValue) => currentValue + 1);
  };

  const handleFormSuccess = () => {
    closeModal();
    setRefreshToken((currentValue) => currentValue + 1);
  };

  return (
    <PageContainer>
      <PageHeader
        actions={
          <Button iconLeft={<Icon name="plus" size={16} />} onClick={openCreateModal}>
            Nueva actividad
          </Button>
        }
        description="Gestiona y programa el catálogo real de clases y talleres del gimnasio."
        title="Catálogo de actividades"
      />

      <ActivityCatalog
        onCreateRequest={openCreateModal}
        onEditRequest={openEditModal}
        onRosterRequest={openRosterModal}
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

      {rosterActivityId ? (
        <ClassRosterModal
          activityId={rosterActivityId}
          onClose={closeRosterModal}
        />
      ) : null}
    </PageContainer>
  );
}
