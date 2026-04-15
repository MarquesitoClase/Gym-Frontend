import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { UserFormModal } from "../features/users/UserFormModal";
import { UsersTableSection } from "../features/users/UsersTableSection";

export function UsersPage() {
  const [editorState, setEditorState] = useState({
    mode: null,
    userId: null
  });
  const [refreshToken, setRefreshToken] = useState(0);

  const openCreateModal = () => {
    setEditorState({
      mode: "create",
      userId: null
    });
  };

  const openEditModal = (userId) => {
    setEditorState({
      mode: "edit",
      userId
    });
  };

  const closeModal = () => {
    setEditorState({
      mode: null,
      userId: null
    });
  };

  const handleFormSuccess = () => {
    closeModal();
    setRefreshToken((currentValue) => currentValue + 1);
  };

  return (
    <PageContainer>
      <PageHeader
        breadcrumb={["Admin", "Usuarios"]}
        title="Usuarios"
        description="Gestiona altas, estado y renovaciones de socios."
        actions={
          <Button iconLeft={<Icon name="plus" size={16} />} onClick={openCreateModal}>
            Nuevo usuario
          </Button>
        }
      />

      <UsersTableSection
        onEditRequest={openEditModal}
        refreshToken={refreshToken}
      />

      {editorState.mode ? (
        <UserFormModal
          mode={editorState.mode}
          onClose={closeModal}
          onSuccess={handleFormSuccess}
          userId={editorState.userId}
        />
      ) : null}
    </PageContainer>
  );
}
