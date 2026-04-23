import { useState } from "react";
import { Button } from "../components/Button/Button";
import { Icon } from "../components/Icon/Icon";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { UserFormModal } from "../features/users/UserFormModal";
import { UsersTableSection } from "../features/users/UsersTableSection";
import { useT } from "../i18n/useT";

export function UsersPage() {
  const t = useT();
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
        breadcrumb={[t.admin, t.usuarios]}
        title={t.usuarios}
        description={t.usuariosDescripcion}
        actions={
          <Button iconLeft={<Icon name="plus" size={16} />} onClick={openCreateModal}>
            {t.nuevoUsuario}
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
