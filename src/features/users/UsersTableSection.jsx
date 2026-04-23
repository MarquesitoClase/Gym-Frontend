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
import { useT } from "../../i18n/useT";
import { usersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildUsersSummaryMetrics,
  mapUserDtoToRow
} from "../../services/mappers/usersMapper";
import "./UsersTableSection.css";

const PAGE_SIZE = 4;
const usersDirectoryFormatter = new Intl.NumberFormat("es-ES");

function buildStatusMap(t) {
  return {
    active: {
      label: t.activo,
      tone: "active"
    },
    attention: {
      label: t.revisar,
      tone: "attention"
    },
    inactive: {
      label: t.inactivo,
      tone: "inactive"
    }
  };
}

export function UsersTableSection({ onEditRequest, refreshToken = 0 }) {
  const t = useT();
  const statusMap = useMemo(() => buildStatusMap(t), [t]);
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
        setErrorMessage(getApiErrorMessage(error, t.noSePudieronCargarUsuarios));
        setRequestState("error");
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, [reloadKey, refreshToken, t.noSePudieronCargarUsuarios]);

  const summaryMetrics = useMemo(
    () =>
      buildUsersSummaryMetrics(rows, requestState, {
        totalMembers: t.sociosTotales,
        activeNow: t.activosAhora,
        inactiveMembers: t.sociosInactivos,
        loadingRealData: t.cargandoDatosReales,
        noBackend: t.sinConexionBackend,
        recordsInSystem: t.registrosEnSistema,
        totalOperational: t.delTotalOperativo,
        noActiveAccess: t.perfilesSinAccesoActivo,
        allActive: t.todosSociosActivos
      }),
    [requestState, rows, t]
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

  const emptyState =
    requestState === "loading" ? (
      <EmptyState
        description={t.cargandoUsuariosDesc}
        icon="search"
        title={t.cargandoUsuarios}
      />
    ) : requestState === "error" ? (
      <EmptyState
        action={
          <Button onClick={handleRetry} size="sm" variant="secondary">
            {t.reintentar}
          </Button>
        }
        description={errorMessage}
        icon="warning"
        title={t.noSePudieronCargarUsuarios}
      />
    ) : (
      <EmptyState
        description={t.sinUsuariosDesc}
        title={t.sinUsuarios}
      />
    );

  const columns = [
    {
      key: "member",
      label: t.foto,
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
      label: t.nombre,
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
      label: t.dniId
    },
    {
      key: "enrollmentYear",
      label: t.anoAlta
    },
    {
      key: "status",
      label: t.estado,
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
      label: t.acciones,
      render: (row) => (
        <div className="users-actions">
          <ToggleSwitch
            disabled
            checked={row.isEnabled}
            label={row.isEnabled ? t.activo : t.inactivo}
          />
          <button
            aria-label={`Editar a ${row.name}`}
            className="users-action-button"
            onClick={() => onEditRequest?.(row.id)}
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
                {t.mostrando} {paginatedRows.length} {t.de}{" "}
                {usersDirectoryFormatter.format(rows.length)} {t.usuarios}
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
                  {t.filtros}
                </Button>
                <Button
                  disabled={requestState !== "success" || !rows.length}
                  iconLeft={<Icon name="download" size={16} />}
                  size="sm"
                  variant="ghost"
                >
                  {t.exportar}
                </Button>
              </div>
            }
            title={t.directorioSocios}
          />
        }
        rows={requestState === "success" ? paginatedRows : []}
      />
    </div>
  );
}
