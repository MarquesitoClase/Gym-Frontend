import { useState } from "react";
import { Button } from "../components/Button/Button";
import { Icon } from "../components/Icon/Icon";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { TeacherFormModal } from "../features/teachers/TeacherFormModal";
import { TeachersTableSection } from "../features/teachers/TeachersTableSection";
import { teachersService } from "../services";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { notifyError, notifySuccess } from "../utils/notifications";

export function TeachersPage() {
  const [editorState, setEditorState] = useState({
    mode: null,
    teacherId: null
  });
  const [refreshToken, setRefreshToken] = useState(0);

  const openCreateModal = () => {
    setEditorState({
      mode: "create",
      teacherId: null
    });
  };

  const openEditModal = (teacherId) => {
    setEditorState({
      mode: "edit",
      teacherId
    });
  };

  const closeModal = () => {
    setEditorState({
      mode: null,
      teacherId: null
    });
  };

  const handleFormSuccess = () => {
    closeModal();
    setRefreshToken((currentValue) => currentValue + 1);
  };

  const handleDeleteRequest = async (teacher) => {
    const confirmed = window.confirm(
      `Vas a eliminar al monitor ${teacher.name} de forma permanente. ¿Continuar?`
    );

    if (!confirmed) return;

    try {
      await teachersService.remove(teacher.id);
      notifySuccess("Monitor eliminado correctamente.");
      setRefreshToken((currentValue) => currentValue + 1);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "No se pudo eliminar el monitor."));
    }
  };

  return (
    <PageContainer>
      <PageHeader
        actions={
          <Button
            iconLeft={<Icon name="plus" size={16} />}
            onClick={openCreateModal}
          >
            Nuevo monitor
          </Button>
        }
        breadcrumb={["Admin", "Monitores"]}
        description="Supervisa disponibilidad, certificaciones y asignaciones del equipo de monitores."
        title="Monitores"
      />

      <TeachersTableSection
        onDeleteRequest={handleDeleteRequest}
        onEditRequest={openEditModal}
        refreshToken={refreshToken}
      />

      {editorState.mode ? (
        <TeacherFormModal
          mode={editorState.mode}
          onClose={closeModal}
          onSuccess={handleFormSuccess}
          teacherId={editorState.teacherId}
        />
      ) : null}
    </PageContainer>
  );
}
