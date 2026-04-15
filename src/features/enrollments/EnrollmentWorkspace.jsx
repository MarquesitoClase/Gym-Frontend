import { useEffect, useMemo, useState } from "react";
import { AvatarCell } from "../../components/ui/AvatarCell";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { InfoBanner } from "../../components/ui/InfoBanner";
import { LoadingState } from "../../components/ui/LoadingState";
import { SelectableCard } from "../../components/ui/SelectableCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { TableToolbar } from "../../components/ui/TableToolbar";
import { activitiesService, enrollmentsService, teachersService, usersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  mapEnrollmentActivityOptions,
  mapUserActivityRows,
  mapUserCandidate
} from "../../services/mappers/enrollmentsMapper";

const enrollmentStatusMap = {
  confirmed: {
    label: "Inscrita",
    tone: "active"
  }
};

const columns = [
  {
    key: "activity",
    label: "Actividad"
  },
  {
    key: "teacher",
    label: "Profesor"
  },
  {
    key: "schedule",
    label: "Fecha"
  },
  {
    align: "end",
    key: "status",
    label: "Estado",
    render: (row) => (
      <StatusBadge
        label={enrollmentStatusMap[row.status].label}
        tone={enrollmentStatusMap[row.status].tone}
      />
    )
  }
];

export function EnrollmentWorkspace() {
  const [activities, setActivities] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [query, setQuery] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [userActivitiesReloadKey, setUserActivitiesReloadKey] = useState(0);
  const [userActivitiesState, setUserActivitiesState] = useState("idle");
  const [workspaceError, setWorkspaceError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadWorkspace() {
      setRequestState("loading");
      setWorkspaceError("");
      setFeedback(null);

      try {
        const [usersResponse, activitiesResponse, teachersResponse] = await Promise.all([
          usersService.list(),
          activitiesService.list(),
          teachersService.list()
        ]);

        if (ignore) {
          return;
        }

        setUsers(usersResponse.map(mapUserCandidate));
        setActivities(activitiesResponse);
        setTeachers(teachersResponse);
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setUsers([]);
        setActivities([]);
        setTeachers([]);
        setWorkspaceError(
          getApiErrorMessage(error, "No se pudo preparar el panel de inscripciones.")
        );
        setRequestState("error");
      }
    }

    loadWorkspace();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    let ignore = false;

    async function loadUserActivities() {
      if (!selectedUserId) {
        setUserActivities([]);
        setUserActivitiesState("idle");
        return;
      }

      setUserActivitiesState("loading");
      setFeedback(null);

      try {
        const response = await enrollmentsService.listByUser(selectedUserId);

        if (ignore) {
          return;
        }

        setUserActivities(response);
        setUserActivitiesState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setUserActivities([]);
        setUserActivitiesState("error");
        setFeedback({
          message: getApiErrorMessage(
            error,
            "No se pudieron consultar las actividades del usuario."
          ),
          tone: "warning",
          title: "No se pudieron cargar las actividades del usuario"
        });
      }
    }

    loadUserActivities();

    return () => {
      ignore = true;
    };
  }, [selectedUserId, userActivitiesReloadKey]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users]
  );

  const enrolledIds = useMemo(
    () => new Set(userActivities.map((activity) => activity.id)),
    [userActivities]
  );

  const activityOptions = useMemo(
    () => mapEnrollmentActivityOptions(activities, teachers, enrolledIds),
    [activities, enrolledIds, teachers]
  );

  const selectedActivity = useMemo(
    () =>
      activityOptions.find((activity) => activity.id === selectedActivityId) ?? null,
    [activityOptions, selectedActivityId]
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const rows = normalizedQuery
      ? users.filter((user) =>
          [user.name, user.identifier]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery))
        )
      : users;

    return rows.slice(0, 6);
  }, [query, users]);

  const userActivityRows = useMemo(
    () => mapUserActivityRows(userActivities, teachers),
    [teachers, userActivities]
  );

  const userCanRegister = Boolean(selectedUser?.active);
  const duplicateEnrollment = Boolean(
    selectedActivity && enrolledIds.has(selectedActivity.id)
  );
  const futureLimitReached = Boolean(
    selectedUser && userActivities.length >= 3 && !duplicateEnrollment
  );

  const validationChecklist = [
    {
      id: "user-active",
      label: "Usuario activo",
      text: selectedUser
        ? selectedUser.active
          ? "El usuario puede operar con normalidad en recepcion."
          : "El backend bloqueara la inscripcion porque el usuario esta inactivo."
        : "Selecciona un usuario para validar su estado.",
      tone: selectedUser ? (selectedUser.active ? "active" : "attention") : "pending"
    },
    {
      id: "duplicate-check",
      label: "Duplicidad",
      text: selectedActivity
        ? duplicateEnrollment
          ? "El usuario ya esta inscrito en esta actividad."
          : "No existe una inscripcion previa para la actividad elegida."
        : "Selecciona una actividad para comprobar duplicados.",
      tone: selectedActivity
        ? duplicateEnrollment
          ? "attention"
          : "active"
        : "pending"
    },
    {
      id: "future-limit",
      label: "Limite de futuras",
      text: selectedUser
        ? futureLimitReached
          ? `El usuario ya tiene ${userActivities.length} actividades futuras registradas.`
          : `${userActivities.length} actividades futuras registradas en backend.`
        : "Selecciona un usuario para calcular el limite actual.",
      tone: selectedUser
        ? futureLimitReached
          ? "attention"
          : "active"
        : "pending"
    }
  ];

  const canSubmit =
    Boolean(selectedUser) &&
    Boolean(selectedActivity) &&
    userActivitiesState === "success" &&
    userCanRegister &&
    !duplicateEnrollment &&
    !futureLimitReached &&
    !isSubmitting;

  const handleRetryWorkspace = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    setSelectedActivityId(null);
    setFeedback(null);
  };

  const handleRetryUserActivities = () => {
    setUserActivitiesReloadKey((currentValue) => currentValue + 1);
  };

  const handleResetSelection = () => {
    setSelectedUserId(null);
    setSelectedActivityId(null);
    setUserActivities([]);
    setUserActivitiesState("idle");
    setFeedback(null);
    setQuery("");
  };

  const handleRegister = async () => {
    if (!selectedUser || !selectedActivity) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await enrollmentsService.register(selectedActivity.id, selectedUser.id);
      const nextUserActivities = await enrollmentsService.listByUser(selectedUser.id);

      setUserActivities(nextUserActivities);
      setUserActivitiesState("success");
      setSelectedActivityId(null);
      setFeedback({
        message: `${selectedUser.name} se ha inscrito correctamente en ${selectedActivity.title}.`,
        tone: "success",
        title: "Inscripcion confirmada"
      });
    } catch (error) {
      setFeedback({
        message: getApiErrorMessage(
          error,
          "No se pudo completar la inscripcion seleccionada."
        ),
        tone: "warning",
        title: "Inscripcion rechazada"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (requestState === "loading") {
    return <LoadingState lines={5} />;
  }

  if (requestState === "error") {
    return (
      <SurfaceCard className="enrollment-panel">
        <EmptyState
          action={
            <Button onClick={handleRetryWorkspace} size="sm" variant="secondary">
              Reintentar
            </Button>
          }
          description={workspaceError}
          icon="warning"
          title="No se pudo cargar el panel de inscripciones"
        />
      </SurfaceCard>
    );
  }

  return (
    <div className="enrollment-layout">
      <div className="enrollment-layout__primary">
        <SurfaceCard className="enrollment-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Seleccion de usuario</h2>
              <p className="panel-description">
                Busca un usuario por nombre o DNI y consulta sus actividades futuras.
              </p>
            </div>
            {selectedUser ? (
              <Button onClick={handleResetSelection} size="sm" variant="ghost">
                Limpiar
              </Button>
            ) : null}
          </div>

          <label className="search-field">
            <span className="search-field__label">Buscar usuario</span>
            <div className="search-field__control">
              <Icon name="search" size={18} />
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nombre o DNI"
                type="search"
                value={query}
              />
            </div>
          </label>

          {selectedUser ? (
            <div className="enrollment-selected-user">
              <div className="enrollment-selected-user__header">
                <AvatarCell
                  imageUrl={selectedUser.avatarUrl}
                  subtitle={`DNI ${selectedUser.identifier}`}
                  title={selectedUser.name}
                />
                <StatusBadge
                  label={selectedUser.active ? "Activo" : "Inactivo"}
                  tone={selectedUser.active ? "active" : "inactive"}
                />
              </div>
              <div className="enrollment-selected-user__meta">
                <span>Ano de alta: {selectedUser.registrationYear}</span>
                <span>
                  Actividades futuras actuales: {userActivities.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="enrollment-user-results">
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <SelectableCard
                    key={user.id}
                    meta={`Alta ${user.registrationYear}`}
                    onClick={() => handleSelectUser(user.id)}
                    selected={user.id === selectedUserId}
                    subtitle={user.identifier}
                    title={user.name}
                    trailing={
                      <StatusBadge
                        label={user.active ? "Activo" : "Inactivo"}
                        tone={user.active ? "active" : "inactive"}
                      />
                    }
                  />
                ))
              ) : (
                <EmptyState
                  description="No hemos encontrado usuarios que coincidan con la busqueda."
                  icon="users"
                  title="Sin resultados"
                />
              )}
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard className="enrollment-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Actividades disponibles</h2>
              <p className="panel-description">
                Selecciona una actividad futura para inscribir al usuario elegido.
              </p>
            </div>
          </div>

          {!selectedUser ? (
            <EmptyState
              description="Selecciona primero un usuario para activar la eleccion de actividad."
              icon="activities"
              title="Usuario pendiente"
            />
          ) : userActivitiesState === "loading" ? (
            <LoadingState lines={4} />
          ) : userActivitiesState === "error" ? (
            <EmptyState
              action={
                <Button
                  onClick={handleRetryUserActivities}
                  size="sm"
                  variant="secondary"
                >
                  Reintentar
                </Button>
              }
              description="No se pudieron recuperar las actividades del usuario para validar la inscripcion."
              icon="warning"
              title="Validacion pendiente"
            />
          ) : (
            <div className="enrollment-activity-list">
              {activityOptions.map((activity) => (
                <SelectableCard
                  key={activity.id}
                  meta={activity.description}
                  onClick={() => setSelectedActivityId(activity.id)}
                  selected={activity.id === selectedActivityId}
                  subtitle={activity.teacher}
                  title={activity.title}
                  trailing={
                    activity.alreadyEnrolled ? (
                      <StatusBadge label="Ya inscrito" tone="attention" />
                    ) : (
                      <StatusBadge label={activity.priceLabel} tone="neutral" />
                    )
                  }
                  footer={
                    <div className="enrollment-card-footer">
                      <div className="enrollment-card-footer__item">
                        <Icon name="calendar" size={15} />
                        <span>{activity.schedule}</span>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </SurfaceCard>
      </div>

      <div className="enrollment-layout__secondary">
        <SurfaceCard className="enrollment-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Validaciones de backend</h2>
              <p className="panel-description">
                Estas reglas reflejan exactamente lo que valida Spring al inscribir.
              </p>
            </div>
          </div>

          <div className="validation-list">
            {validationChecklist.map((rule) => (
              <div className="validation-list__item" key={rule.id}>
                <div>
                  <strong>{rule.label}</strong>
                  <p>{rule.text}</p>
                </div>
                <StatusBadge
                  label={
                    rule.tone === "active"
                      ? "OK"
                      : rule.tone === "attention"
                      ? "Bloqueado"
                      : "Pendiente"
                  }
                  tone={rule.tone}
                />
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="enrollment-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Confirmacion</h2>
              <p className="panel-description">
                Revisa el usuario y la actividad antes de enviar la inscripcion.
              </p>
            </div>
          </div>

          {feedback ? (
            <InfoBanner
              icon={
                <Icon
                  name={feedback.tone === "success" ? "check" : "warning"}
                  size={18}
                />
              }
              title={feedback.title}
              tone={feedback.tone}
            >
              {feedback.message}
            </InfoBanner>
          ) : null}

          <div className="enrollment-summary">
            <div className="enrollment-summary__item">
              <span className="enrollment-summary__label">Usuario</span>
              <strong>{selectedUser?.name ?? "Sin seleccionar"}</strong>
            </div>
            <div className="enrollment-summary__item">
              <span className="enrollment-summary__label">Actividad</span>
              <strong>{selectedActivity?.title ?? "Sin seleccionar"}</strong>
            </div>
            <div className="enrollment-summary__item">
              <span className="enrollment-summary__label">Profesor</span>
              <strong>{selectedActivity?.teacher ?? "Pendiente"}</strong>
            </div>
            <div className="enrollment-summary__item">
              <span className="enrollment-summary__label">Fecha</span>
              <strong>{selectedActivity?.schedule ?? "Pendiente"}</strong>
            </div>
          </div>

          <Button
            disabled={!canSubmit}
            fullWidth
            iconLeft={<Icon name="check" size={16} />}
            onClick={handleRegister}
          >
            {isSubmitting ? "Confirmando..." : "Confirmar inscripcion"}
          </Button>
        </SurfaceCard>
      </div>

      <div className="enrollment-layout__full">
        <DataTable
          columns={columns}
          emptyState={
            selectedUser ? (
              userActivitiesState === "loading" ? (
                <LoadingState lines={4} />
              ) : (
                <EmptyState
                  description="El usuario aun no tiene actividades futuras inscritas."
                  title="Sin actividades registradas"
                />
              )
            ) : (
              <EmptyState
                description="Selecciona un usuario para ver sus actividades futuras actuales."
                title="Sin usuario seleccionado"
              />
            )
          }
          header={
            <TableToolbar
              description="Resumen de actividades futuras ya registradas para el usuario elegido."
              title="Actividades del usuario"
            />
          }
          rows={selectedUser && userActivitiesState === "success" ? userActivityRows : []}
        />
      </div>
    </div>
  );
}
