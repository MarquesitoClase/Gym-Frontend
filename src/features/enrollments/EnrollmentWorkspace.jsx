import { useEffect, useMemo, useState } from "react";
import { AvatarCell } from "../../components/AvatarCells/AvatarCell";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Icon } from "../../components/Icon/Icon";
import { LoadingState } from "../../components/LoadingState/LoadingState";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard";
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
// import { formatDateTime } from "../../utils/formatters";

// ─── Paso indicator ──────────────────────────────────────────
function StepIndicator({ currentStep }) {
  const steps = [
    { label: "Elige socio", number: 1 },
    { label: "Elige actividad", number: 2 },
    { label: "Confirma", number: 3 }
  ];

  return (
    <div className="enroll-steps">
      {steps.map((step, index) => {
        const isDone = currentStep > step.number;
        const isActive = currentStep === step.number;
        return (
          <div className="enroll-steps__item" key={step.number}>
            <div
              className={[
                "enroll-steps__bubble",
                isDone && "enroll-steps__bubble--done",
                isActive && "enroll-steps__bubble--active"
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {isDone ? <Icon name="check" size={13} /> : step.number}
            </div>
            <span
              className={[
                "enroll-steps__label",
                isActive && "enroll-steps__label--active"
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {step.label}
            </span>
            {index < steps.length - 1 ? (
              <div
                className={[
                  "enroll-steps__line",
                  isDone && "enroll-steps__line--done"
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// ─── Activity card para la selección ────────────────────────
function ActivityOptionCard({ activity, onSelect, selected }) {
  return (
    <button
      className={[
        "enroll-activity-option",
        selected && "enroll-activity-option--selected",
        activity.alreadyEnrolled && "enroll-activity-option--enrolled"
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => !activity.alreadyEnrolled && onSelect(activity.id)}
      type="button"
    >
      <div className="enroll-activity-option__header">
        <strong className="enroll-activity-option__title">{activity.title}</strong>
        {activity.alreadyEnrolled ? (
          <StatusBadge label="Ya inscrito" tone="attention" />
        ) : (
          <span className="enroll-activity-option__price">{activity.priceLabel}</span>
        )}
      </div>
      <div className="enroll-activity-option__meta">
        <span>
          <Icon name="user" size={13} />
          {activity.teacher}
        </span>
        <span>
          <Icon name="calendar" size={13} />
          {activity.schedule}
        </span>
        <span>
          <Icon name="users" size={13} />
          {activity.enrolledCount}{" "}
          {activity.enrolledCount === 1 ? "inscrito" : "inscritos"}
        </span>
      </div>
    </button>
  );
}

// ─── Main component ──────────────────────────────────────────
export function EnrollmentWorkspace() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [query, setQuery] = useState("");
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");
  const [userEnrollState, setUserEnrollState] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { tone, message }

  // Carga inicial
  useEffect(() => {
    let ignore = false;
    setLoadState("loading");

    Promise.all([
      usersService.list(),
      activitiesService.list(),
      teachersService.list()
    ])
      .then(([usersRes, activitiesRes, teachersRes]) => {
        if (ignore) return;
        setUsers(usersRes.map(mapUserCandidate));
        setActivities(activitiesRes);
        setTeachers(teachersRes);
        setLoadState("success");
      })
      .catch((error) => {
        if (ignore) return;
        setLoadError(getApiErrorMessage(error, "No se pudieron cargar los datos."));
        setLoadState("error");
      });

    return () => { ignore = true; };
  }, []);

  // Carga inscripciones del usuario seleccionado
  useEffect(() => {
    if (!selectedUserId) {
      setUserEnrollments([]);
      setUserEnrollState("idle");
      return;
    }

    let ignore = false;
    setUserEnrollState("loading");

    enrollmentsService
      .listByUser(selectedUserId)
      .then((res) => {
        if (ignore) return;
        setUserEnrollments(res);
        setUserEnrollState("success");
      })
      .catch(() => {
        if (ignore) return;
        setUserEnrollments([]);
        setUserEnrollState("error");
      });

    return () => { ignore = true; };
  }, [selectedUserId]);

  // ── Computed ──────────────────────────────────────────────
  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  const enrolledIds = useMemo(
    () => new Set(userEnrollments.map((a) => a.id)),
    [userEnrollments]
  );

  const activityOptions = useMemo(
    () => mapEnrollmentActivityOptions(activities, teachers, enrolledIds),
    [activities, teachers, enrolledIds]
  );

  const selectedActivity = useMemo(
    () => activityOptions.find((a) => a.id === selectedActivityId) ?? null,
    [activityOptions, selectedActivityId]
  );

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? users.filter((u) =>
          [u.name, u.identifier]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q))
        )
      : users;
  }, [query, users]);

  // ── Validaciones ──────────────────────────────────────────
  const isUserActive = Boolean(selectedUser?.active);
  const isDuplicate = Boolean(selectedActivity?.alreadyEnrolled);
  const hasNoTeacher = Boolean(selectedActivity) && !selectedActivity.teacherId;
  const futureLimitReached =
    userEnrollState === "success" && userEnrollments.length >= 3 && !isDuplicate;

  const canSubmit =
    Boolean(selectedUser) &&
    Boolean(selectedActivity) &&
    userEnrollState === "success" &&
    isUserActive &&
    !isDuplicate &&
    !hasNoTeacher &&
    !futureLimitReached &&
    !isSubmitting;

  // Paso actual para el indicador
  const currentStep = !selectedUser ? 1 : !selectedActivity ? 2 : 3;

  // ── Handlers ─────────────────────────────────────────────
  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    setSelectedActivityId(null);
    setSubmitResult(null);
  };

  const handleReset = () => {
    setSelectedUserId(null);
    setSelectedActivityId(null);
    setUserEnrollments([]);
    setUserEnrollState("idle");
    setSubmitResult(null);
    setQuery("");
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      await enrollmentsService.register(selectedActivity.id, selectedUser.id);
      const updated = await enrollmentsService.listByUser(selectedUser.id);
      setUserEnrollments(updated);
      setSelectedActivityId(null);
      setSubmitResult({
        tone: "success",
        message: `${selectedUser.name} inscrito correctamente en ${selectedActivity.title}.`
      });
    } catch (error) {
      setSubmitResult({
        tone: "error",
        message: getApiErrorMessage(error, "No se pudo completar la inscripcion.")
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render estados de carga/error ─────────────────────────
  if (loadState === "loading") {
    return <LoadingState lines={5} />;
  }

  if (loadState === "error") {
    return (
      <SurfaceCard>
        <EmptyState
          description={loadError}
          icon="warning"
          title="No se pudo cargar el panel"
        />
      </SurfaceCard>
    );
  }

  // ── Render principal ──────────────────────────────────────
  return (
    <div className="enroll-workspace">
      {/* Indicador de pasos */}
      <StepIndicator currentStep={currentStep} />

      <div className="enroll-workspace__body">
        {/* ── Columna izquierda: selección de socio ── */}
        <div className="enroll-workspace__col enroll-workspace__col--users">
          <SurfaceCard className="enroll-panel">
            <div className="enroll-panel__header">
              <h2 className="enroll-panel__title">
                <span className="enroll-panel__step-num">1</span>
                Socio
              </h2>
              {selectedUser ? (
                <button
                  className="enroll-panel__reset"
                  onClick={handleReset}
                  type="button"
                >
                  Cambiar
                </button>
              ) : null}
            </div>

            {selectedUser ? (
              <div className="enroll-selected-user">
                <AvatarCell
                  imageUrl={selectedUser.avatarUrl}
                  subtitle={`DNI ${selectedUser.identifier}`}
                  title={selectedUser.name}
                />
                <div className="enroll-selected-user__status">
                  <StatusBadge
                    label={selectedUser.active ? "Activo" : "Inactivo"}
                    tone={selectedUser.active ? "active" : "inactive"}
                  />
                  {userEnrollState === "success" ? (
                    <span className="enroll-selected-user__count">
                      {userEnrollments.length}/3 actividades futuras
                    </span>
                  ) : null}
                </div>

                {!isUserActive ? (
                  <div className="enroll-alert enroll-alert--warning">
                    Socio inactivo — el backend bloqueara la inscripcion.
                  </div>
                ) : null}

                {futureLimitReached ? (
                  <div className="enroll-alert enroll-alert--warning">
                    Limite alcanzado: ya tiene 3 actividades futuras.
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <label className="enroll-search">
                  <Icon name="search" size={16} />
                  <input
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nombre o DNI..."
                    type="search"
                    value={query}
                  />
                </label>

                <div className="enroll-user-list">
                  {filteredUsers.length ? (
                    filteredUsers.map((user) => (
                      <button
                        className="enroll-user-row"
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        type="button"
                      >
                        <div className="enroll-user-row__avatar">
                          {user.avatarUrl ? (
                            <img alt={user.name} src={user.avatarUrl} />
                          ) : (
                            <span>{user.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="enroll-user-row__info">
                          <strong>{user.name}</strong>
                          <span>{user.identifier}</span>
                        </div>
                        <StatusBadge
                          label={user.active ? "Activo" : "Inactivo"}
                          tone={user.active ? "active" : "inactive"}
                        />
                      </button>
                    ))
                  ) : (
                    <EmptyState
                      description="Prueba con otro nombre o DNI."
                      icon="search"
                      title="Sin resultados"
                    />
                  )}
                </div>
              </>
            )}
          </SurfaceCard>
        </div>

        {/* ── Columna derecha: selección de actividad ── */}
        <div className="enroll-workspace__col enroll-workspace__col--activities">
          <SurfaceCard className="enroll-panel">
            <div className="enroll-panel__header">
              <h2 className="enroll-panel__title">
                <span className="enroll-panel__step-num">2</span>
                Actividad
              </h2>
              {selectedActivity ? (
                <button
                  className="enroll-panel__reset"
                  onClick={() => {
                    setSelectedActivityId(null);
                    setSubmitResult(null);
                  }}
                  type="button"
                >
                  Cambiar
                </button>
              ) : null}
            </div>

            {!selectedUser ? (
              <EmptyState
                description="Selecciona primero un socio para ver las actividades disponibles."
                icon="activities"
                title="Primero elige un socio"
              />
            ) : userEnrollState === "loading" ? (
              <LoadingState lines={3} />
            ) : (
              <div className="enroll-activity-list">
                {activityOptions.length ? (
                  activityOptions.map((activity) => (
                    <ActivityOptionCard
                      activity={activity}
                      key={activity.id}
                      onSelect={setSelectedActivityId}
                      selected={activity.id === selectedActivityId}
                    />
                  ))
                ) : (
                  <EmptyState
                    description="No hay actividades futuras disponibles en este momento."
                    icon="activities"
                    title="Sin actividades"
                  />
                )}
              </div>
            )}
          </SurfaceCard>
        </div>
      </div>

      {/* ── Barra de confirmacion ── */}
      <div
        className={[
          "enroll-confirm-bar",
          (selectedUser && selectedActivity) && "enroll-confirm-bar--visible"
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {submitResult ? (
          <div
            className={[
              "enroll-confirm-bar__result",
              submitResult.tone === "success"
                ? "enroll-confirm-bar__result--success"
                : "enroll-confirm-bar__result--error"
            ].join(" ")}
          >
            <Icon
              name={submitResult.tone === "success" ? "check" : "warning"}
              size={16}
            />
            {submitResult.message}
          </div>
        ) : (
          <div className="enroll-confirm-bar__summary">
            <div className="enroll-confirm-bar__item">
              <span>Socio</span>
              <strong>{selectedUser?.name ?? "—"}</strong>
            </div>
            <Icon name="chevron" size={16} />
            <div className="enroll-confirm-bar__item">
              <span>Actividad</span>
              <strong>{selectedActivity?.title ?? "—"}</strong>
            </div>
            {selectedActivity ? (
              <>
                <Icon name="chevron" size={16} />
                <div className="enroll-confirm-bar__item">
                  <span>Fecha</span>
                  <strong>{selectedActivity.schedule}</strong>
                </div>
                <div className="enroll-confirm-bar__item">
                  <span>Precio</span>
                  <strong>{selectedActivity.priceLabel}</strong>
                </div>
              </>
            ) : null}
          </div>
        )}

        <div className="enroll-confirm-bar__actions">
          {!submitResult ? (
            <>
              {isDuplicate && (
                <span className="enroll-confirm-bar__block-reason">
                  Ya inscrito en esta actividad
                </span>
              )}
              {hasNoTeacher && (
                <span className="enroll-confirm-bar__block-reason">
                  Sin monitor asignado
                </span>
              )}
              <Button
                disabled={!canSubmit}
                iconLeft={<Icon name="check" size={16} />}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Inscribiendo..." : "Confirmar inscripcion"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setSubmitResult(null)} variant="ghost">
              Nueva inscripcion
            </Button>
          )}
          <Button onClick={handleReset} variant="ghost">
            Reiniciar
          </Button>
        </div>
      </div>
    </div>
  );
}
