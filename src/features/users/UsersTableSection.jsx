import { useEffect, useMemo, useState } from "react";
import { AvatarCell } from "../../components/ui/AvatarCell";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { Pagination } from "../../components/ui/Pagination";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TableToolbar } from "../../components/ui/TableToolbar";
import { ToggleSwitch } from "../../components/ui/ToggleSwitch";
import { usersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildUsersSummaryMetrics,
  mapUserDtoToRow
} from "../../services/mappers/usersMapper";
import "./UsersTableSection.css";

const PAGE_SIZE = 4;
const usersDirectoryFormatter = new Intl.NumberFormat("es-ES");

const statusMap = {
  active: {
    label: "Activo",
    tone: "active"
  },
  attention: {
    label: "Revisar",
    tone: "attention"
  },
  inactive: {
    label: "Inactivo",
    tone: "inactive"
  }
};

export function UsersTableSection() {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const users = await usersService.list();

        if (ignore) {
          return;
        }

        setRows(users.map(mapUserDtoToRow));
        setPage(1);
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setRows([]);
        setErrorMessage(
          getApiErrorMessage(error, "No se pudieron cargar los usuarios.")
        );
        setRequestState("error");
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const summaryMetrics = useMemo(
    () => buildUsersSummaryMetrics(rows, requestState),
    [requestState, rows]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [currentPage, rows]);

  const handleRetry = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  const emptyState =
    requestState === "loading" ? (
      <EmptyState
        description="Estamos consultando la API para traer el listado real de socios."
        icon="search"
        title="Cargando usuarios"
      />
    ) : requestState === "error" ? (
      <EmptyState
        action={
          <Button onClick={handleRetry} size="sm" variant="secondary">
            Reintentar
          </Button>
        }
        description={errorMessage}
        icon="warning"
        title="No se pudieron cargar los usuarios"
      />
    ) : (
      <EmptyState
        description="Cuando lleguen registros desde la base de datos, el listado de socios aparecera aqui."
        title="Todavia no hay socios"
      />
    );

  const columns = [
    {
      key: "member",
      label: "Socio",
      render: (row) => (
        <AvatarCell
          imageUrl={row.avatarUrl}
          subtitle={row.subtitle}
          title={row.name}
        />
      ),
      width: "36%"
    },
    {
      key: "identifier",
      label: "DNI / ID"
    },
    {
      key: "enrollmentYear",
      label: "Ano de alta"
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => (
        <StatusBadge
          label={statusMap[row.status].label}
          tone={statusMap[row.status].tone}
        />
      )
    },
    {
      align: "end",
      key: "actions",
      label: "Acciones",
      render: (row) => (
        <div className="users-actions">
          <ToggleSwitch
            disabled
            checked={row.isEnabled}
            label={row.isEnabled ? "Activo" : "Inactivo"}
          />
          <button
            aria-label={`Editar a ${row.name}`}
            className="users-action-button"
            disabled
            type="button"
          >
            <Icon name="edit" size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="users-section">
      <div className="users-section__summary">
        {summaryMetrics.map((metric) => (
          <StatCard
            key={metric.id}
            label={metric.label}
            meta={metric.meta}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>

      <DataTable
        className="users-directory"
        columns={columns}
        emptyState={emptyState}
        footer={
          requestState === "success" && rows.length ? (
            <div className="users-directory__footer">
              <span className="users-directory__meta">
                Mostrando {paginatedRows.length} de{" "}
                {usersDirectoryFormatter.format(rows.length)} socios
              </span>
              <Pagination
                onPageChange={setPage}
                page={currentPage}
                totalPages={totalPages}
              />
            </div>
          ) : null
        }
        header={
          <TableToolbar
            actions={
              <div className="users-toolbar-actions">
                <Button
                  disabled={requestState !== "success" || !rows.length}
                  iconLeft={<Icon name="filter" size={16} />}
                  size="sm"
                  variant="ghost"
                >
                  Filtros
                </Button>
                <Button
                  disabled={requestState !== "success" || !rows.length}
                  iconLeft={<Icon name="download" size={16} />}
                  size="sm"
                  variant="ghost"
                >
                  Exportar
                </Button>
              </div>
            }
            description="Listado conectado al backend real de Spring Boot."
            title="Listado de socios"
          />
        }
        rows={requestState === "success" ? paginatedRows : []}
      />
    </div>
  );
}
