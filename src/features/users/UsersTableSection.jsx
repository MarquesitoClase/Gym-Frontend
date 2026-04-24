import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { DataTable } from "../../components/DataTable/DataTable";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Icon } from "../../components/Icon/Icon";
import { Pagination } from "../../components/Pagination/Pagination";
import { StatCard } from "../../components/StatCard/StatCard";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TableToolbar } from "../../components/TableToolbar/TableToolbar";
import { ToggleSwitch } from "../../components/ToogleSwitch/ToggleSwitch";
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

export function UsersTableSection({ onDeleteRequest, onEditRequest, refreshToken = 0 }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");
  const [rows, setRows] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

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
  }, [reloadKey, refreshToken]);

  const summaryMetrics = useMemo(
    () => buildUsersSummaryMetrics(rows, requestState),
    [requestState, rows]
  );

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    return rows.filter((r) =>
      [r.name, r.identifier]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(query))
    );
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRows]);

  const handleRetry = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  const handleToggleActive = async (row) => {
    const nextActive = !row.isEnabled;

    setRows((current) =>
      current.map((r) =>
        r.id === row.id
          ? { ...r, isEnabled: nextActive, status: nextActive ? "active" : "inactive" }
          : r
      )
    );

    try {
      const payload = new FormData();
      payload.append("firstName", row.firstName);
      payload.append("lastName", row.lastName);
      payload.append("dni", row.dni);
      payload.append("registrationYear", row.registrationYear);
      payload.append("active", String(nextActive));
      payload.append("imageUrl", row.imageUrl);
      await usersService.update(row.id, payload);
    } catch {
      setRows((current) =>
        current.map((r) =>
          r.id === row.id
            ? { ...r, isEnabled: row.isEnabled, status: row.status }
            : r
        )
      );
    }
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
      label: "Foto",
      render: (row) => (
        <div className="table-avatar-only">
          {row.avatarUrl ? (
            <img alt={row.name} src={row.avatarUrl} />
          ) : (
            <span>{row.name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>
      ),
      width: "8%"
    },
    {
      key: "name",
      label: "Nombre",
      render: (row) => (
        <div className="table-identity">
          <strong>{row.name}</strong>
          <span>{row.subtitle}</span>
        </div>
      ),
      width: "28%"
    },
    {
      key: "identifier",
      label: "DNI / ID"
    },
    {
      key: "enrollmentYear",
      label: "Año de alta"
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
            checked={row.isEnabled}
            label={row.isEnabled ? "Activo" : "Inactivo"}
            onChange={() => handleToggleActive(row)}
          />
          <button
            aria-label={`Editar a ${row.name}`}
            className="users-action-button"
            onClick={() => onEditRequest?.(row.id)}
            type="button"
          >
            <Icon name="edit" size={16} />
          </button>
          <button
            aria-label={`Eliminar a ${row.name}`}
            className="users-action-button users-action-button--danger"
            onClick={() => onDeleteRequest?.(row)}
            type="button"
          >
            <Icon name="trash" size={16} />
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
            title="Directorio de socios"
          />
        }
        rows={requestState === "success" ? paginatedRows : []}
      />
    </div>
  );
}
