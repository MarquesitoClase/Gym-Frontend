import { useState } from "react";
import { Button } from "../components/Button/Button";
import { Icon } from "../components/Icon/Icon";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { UserFormModal } from "../features/users/UserFormModal";
import { UsersTableSection } from "../features/users/UsersTableSection";
import { usersService } from "../services";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { notifyError, notifySuccess } from "../utils/notifications";

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

  const handleDeleteRequest = async (user) => {
    const confirmed = window.confirm(
      `Vas a eliminar a ${user.name} de forma permanente. ¿Continuar?`
    );

    if (!confirmed) return;

    try {
      await usersService.remove(user.id);
      notifySuccess("Usuario eliminado correctamente.");
      setRefreshToken((currentValue) => currentValue + 1);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "No se pudo eliminar el usuario."));
    }
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
        onDeleteRequest={handleDeleteRequest}
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
