import { useEffect, useMemo, useState } from "react";
import { AvatarCell } from "../../components/ui/AvatarCell";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { InfoBanner } from "../../components/ui/InfoBanner";
import { LoadingState } from "../../components/ui/LoadingState";
import { SelectableCard } from "../../components/ui/SelectableCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import {
  activitiesService,
  enrollmentsService,
  teachersService,
  usersService
} from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  mapEnrollmentActivityOptions,
  mapUserCandidate
} from "../../services/mappers/enrollmentsMapper";

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
            "No se pudieron consultar las actividades futuras del usuario."
          ),
          tone: "warning",
          title: "No se pudieron cargar las validaciones"
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
    () => activityOptions.find((activity) => activity.id === selectedActivityId) ?? null,
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
      label: "Cuota operativa",
      text: selectedUser
        ? selectedUser.active
          ? "El socio figura activo y puede completar la inscripción."
          : "El backend bloqueará la operación porque el socio está inactivo."
        : "Selecciona un socio para validar el estado de su cuenta.",
      tone: selectedUser ? (selectedUser.active ? "active" : "attention") : "pending"
    },
    {
      id: "duplicate-check",
      label: "Control de duplicidad",
      text: selectedActivity
        ? duplicateEnrollment
          ? "La actividad elegida ya está asociada al socio seleccionado."
          : "No existe una inscripción previa para esta sesión."
        : "Selecciona una actividad para comprobar duplicados.",
      tone: selectedActivity
        ? duplicateEnrollment
          ? "attention"
          : "active"
        : "pending"
    },
    {
      id: "future-limit",
      label: "Límite de futuras",
      text: selectedUser
        ? futureLimitReached
          ? `El socio ya tiene ${userActivities.length} actividades futuras registradas.`
          : `${userActivities.length} actividades futuras registradas actualmente.`
        : "Selecciona un socio para comprobar su carga de futuras.",
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
        title: "Inscripción confirmada"
      });
    } catch (error) {
      setFeedback({
        message: getApiErrorMessage(
          error,
          "No se pudo completar la inscripción seleccionada."
        ),
        tone: "warning",
        title: "Inscripción rechazada"
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
    <div className="enrollment-workspace">
      <div className="enrollment-workspace__grid">
        <div className="enrollment-workspace__sidebar">
          <SurfaceCard className="enrollment-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Socio seleccionado</h2>
              </div>
              {selectedUser ? (
                <button
                  className="dashboard-link-button"
                  onClick={handleResetSelection}
                  type="button"
                >
                  Cambiar
                </button>
              ) : null}
            </div>

            {selectedUser ? (
              <div className="enrollment-selected-user enrollment-selected-user--featured">
                <AvatarCell
                  imageUrl={selectedUser.avatarUrl}
                  subtitle={`DNI ${selectedUser.identifier}`}
                  title={selectedUser.name}
                />
                <div className="enrollment-selected-user__meta">
                  <span>Plan operativo</span>
                  <StatusBadge
                    label={selectedUser.active ? "Activo" : "Inactivo"}
                    tone={selectedUser.active ? "active" : "inactive"}
                  />
                </div>
              </div>
            ) : (
              <EmptyState
                description="Busca y selecciona primero el socio que va a completar la inscripción."
                icon="users"
                title="Sin socio elegido"
              />
            )}
          </SurfaceCard>

          <SurfaceCard className="enrollment-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Buscador de socios</h2>
                <p className="panel-description">
                  Encuentra un usuario por nombre o DNI y activa el flujo de inscripción.
                </p>
              </div>
            </div>

            <label className="search-field">
              <span className="search-field__label">Buscar registro</span>
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

            <div className="enrollment-user-results">
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <SelectableCard
                    className="enrollment-user-card"
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
                  description="No hemos encontrado socios que coincidan con la búsqueda."
                  icon="users"
                  title="Sin resultados"
                />
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="enrollment-panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Validaciones del sistema</h2>
                <p className="panel-description">
                  Reglas reales que ejecuta el backend antes de completar la inscripción.
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
        </div>

        <div className="enrollment-workspace__main">
          <SurfaceCard className="enrollment-panel enrollment-panel--activity">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Selecciona actividad</h2>
                <p className="panel-description">
                  Sesiones futuras disponibles para el socio actualmente seleccionado.
                </p>
              </div>
              <div className="enrollment-panel__toggles">
                <button className="summary-icon-button" type="button">
                  <Icon name="filter" size={16} />
                </button>
                <button className="summary-icon-button" type="button">
                  <Icon name="dashboard" size={16} />
                </button>
              </div>
            </div>

            {!selectedUser ? (
              <EmptyState
                description="Selecciona primero un usuario para activar la elección de actividad."
                icon="activities"
                title="Usuario pendiente"
              />
            ) : userActivitiesState === "loading" ? (
              <LoadingState lines={4} />
            ) : userActivitiesState === "error" ? (
              <EmptyState
                action={
                  <Button onClick={handleRetryUserActivities} size="sm" variant="secondary">
                    Reintentar
                  </Button>
                }
                description="No se pudieron recuperar las actividades del usuario para validar la inscripción."
                icon="warning"
                title="Validación pendiente"
              />
            ) : (
              <div className="enrollment-activity-grid">
                {activityOptions.map((activity) => (
                  <SelectableCard
                    className="enrollment-activity-card"
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
                          <Icon name="clock" size={15} />
                          <span>{activity.schedule}</span>
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard className="enrollment-panel enrollment-panel--confirmation">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Confirmación</h2>
                <p className="panel-description">
                  Revisa el usuario y la actividad antes de enviar la inscripción.
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

            <div className="enrollment-summary-bar">
              <div className="enrollment-summary-bar__block">
                <span className="enrollment-summary-bar__label">Total</span>
                <strong>{selectedActivity?.priceLabel ?? "Pendiente"}</strong>
              </div>
              <div className="enrollment-summary-bar__block">
                <span className="enrollment-summary-bar__label">Estado</span>
                <strong>{canSubmit ? "Listo para inscribir" : "Pendiente"}</strong>
              </div>
              <Button
                disabled={!canSubmit}
                iconLeft={<Icon name="check" size={16} />}
                onClick={handleRegister}
              >
                {isSubmitting ? "Confirmando..." : "Confirmar inscripción"}
              </Button>
              <Button onClick={handleResetSelection} variant="ghost">
                Cancelar
              </Button>
            </div>

            <InfoBanner icon={<Icon name="help" size={18} />} tone="info">
              La confirmación enviará una notificación y actualizará el estado del socio
              directamente en el backend.
            </InfoBanner>

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
                <span className="enrollment-summary__label">Monitor</span>
                <strong>{selectedActivity?.teacher ?? "Pendiente"}</strong>
              </div>
              <div className="enrollment-summary__item">
                <span className="enrollment-summary__label">Fecha</span>
                <strong>{selectedActivity?.schedule ?? "Pendiente"}</strong>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
