import { useState } from "react";
import { Button } from "../components/Button/Button";
import { Icon } from "../components/Icon/Icon";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { TeacherFormModal } from "../features/teachers/TeacherFormModal";
import { TeachersTableSection } from "../features/teachers/TeachersTableSection";

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
