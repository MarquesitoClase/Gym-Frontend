import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarCell } from "../../components/ui/AvatarCell";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { LoadingState } from "../../components/ui/LoadingState";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { activitiesService, teachersService, usersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildDashboardMetrics,
  buildUpcomingActivities
} from "../../services/mappers/dashboardMapper";

const metricIcons = {
  revenue: "activities",
  "teachers-active": "teachers",
  "users-active": "users"
};

function formatSessionCaption(activity) {
  return `Monitor ${activity.teacher}`;
}

export function DashboardOverview() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    activities: [],
    activeTeachers: [],
    activeUsers: [],
    teachers: [],
    users: []
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const [users, activeUsers, teachers, activeTeachers, activities] =
          await Promise.all([
            usersService.list(),
            usersService.listActive(),
            teachersService.list(),
            teachersService.listActive(),
            activitiesService.list()
          ]);

        if (ignore) {
          return;
        }

        setDashboardData({
          activities,
          activeTeachers,
          activeUsers,
          teachers,
          users
        });
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(
            error,
            "No se pudo construir el panel principal con los datos reales."
          )
        );
        setRequestState("error");
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const metrics = useMemo(
    () => buildDashboardMetrics(dashboardData, requestState),
    [dashboardData, requestState]
  );
  const upcomingActivities = useMemo(
    () => buildUpcomingActivities(dashboardData.activities, dashboardData.teachers),
    [dashboardData.activities, dashboardData.teachers]
  );

  const receptionUser =
    dashboardData.users[dashboardData.users.length - 1] ?? null;

  if (requestState === "loading") {
    return <LoadingState lines={6} />;
  }

  if (requestState === "error") {
    return (
      <SurfaceCard className="dashboard-feedback">
        <EmptyState
          action={
            <Button
              onClick={() => setReloadKey((value) => value + 1)}
              size="sm"
              variant="secondary"
            >
              Reintentar
            </Button>
          }
          description={errorMessage}
          icon="warning"
          title="No se pudo cargar el panel principal"
        />
      </SurfaceCard>
    );
  }

  return (
    <div className="dashboard-view">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <h1>El motor cinetico</h1>
          <p>Vista operativa diaria del gimnasio en tiempo real.</p>
        </div>
      </header>

      <div className="dashboard-metrics">
        {metrics.map((metric) => (
          <StatCard
            badge={metric.badge}
            className={
              metric.id === "revenue"
                ? "dashboard-metric dashboard-metric--wide"
                : "dashboard-metric"
            }
            icon={<Icon name={metricIcons[metric.id] ?? "dashboard"} size={18} />}
            key={metric.id}
            label={metric.label}
            meta={metric.meta}
            tone={metric.tone}
            value={metric.value}
          >
            {metric.id === "revenue" ? (
              <ProgressBar
                label="Objetivo mensual"
                tone="primary"
                value={metric.progress ?? 0}
                valueLabel={metric.targetLabel}
              />
            ) : null}
          </StatCard>
        ))}
      </div>

      <div className="dashboard-grid">
        <SurfaceCard className="dashboard-agenda">
          <div className="dashboard-panel__header">
            <div>
              <h2>Proximas actividades</h2>
            </div>
            <button
              className="dashboard-link-button"
              onClick={() => navigate("/actividades")}
              type="button"
            >
              Ver actividades
            </button>
          </div>

          {upcomingActivities.length ? (
            <div className="dashboard-agenda__list">
              {upcomingActivities.slice(0, 4).map((activity) => (
                <article className="dashboard-agenda__item" key={activity.id}>
                  <div className="dashboard-agenda__time">
                    <span className="dashboard-agenda__time-hour">{activity.scheduleTime}</span>
                    <span className="dashboard-agenda__time-date">{activity.scheduleDate}</span>
                  </div>
                  <div className="dashboard-agenda__main">
                    <h3>{activity.name}</h3>
                    <p>{formatSessionCaption(activity)}</p>
                  </div>
                  <div className="dashboard-agenda__side">
                    <span className="dashboard-agenda__occupancy">
                      {activity.enrolledLabel}
                    </span>
                    <span className="dashboard-agenda__metric">
                      {activity.metric}
                    </span>
                  </div>
                  <button
                    aria-label={`Abrir ${activity.name}`}
                    className="dashboard-agenda__cta"
                    onClick={() => navigate("/actividades")}
                    type="button"
                  >
                    <Icon name="edit" size={14} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              description="No hay actividades futuras disponibles en el backend."
              title="Sin sesiones proximas"
            />
          )}
        </SurfaceCard>

        <div className="dashboard-side">
          <SurfaceCard className="dashboard-quickactions">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>Acciones rapidas</h2>
                <p>Accede directamente a las secciones principales.</p>
              </div>
            </div>
            <div className="dashboard-quickactions__list">
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/usuarios")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="users" size={18} />
                </span>
                <div>
                  <strong>Nuevo socio</strong>
                  <span>Registrar alta en el sistema</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/actividades")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="activities" size={18} />
                </span>
                <div>
                  <strong>Nueva actividad</strong>
                  <span>Publicar clase o taller</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/inscripciones")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="enrollments" size={18} />
                </span>
                <div>
                  <strong>Inscripcion rapida</strong>
                  <span>Apuntar socio a una clase</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/profesores")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="teachers" size={18} />
                </span>
                <div>
                  <strong>Nuevo monitor</strong>
                  <span>Dar de alta a un profesor</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="dashboard-frontdesk">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>Ultimo socio registrado</h2>
              </div>
            </div>

            {receptionUser ? (
              <>
                <div className="dashboard-frontdesk__entry">
                  <AvatarCell
                    imageUrl={receptionUser.imageUrl}
                    subtitle={`Alta ${receptionUser.registrationYear ?? "reciente"}`}
                    title={[receptionUser.firstName, receptionUser.lastName].filter(Boolean).join(" ")}
                  />
                  <StatusBadge
                    label={receptionUser.active ? "Activo" : "Inactivo"}
                    tone={receptionUser.active ? "active" : "inactive"}
                  />
                </div>
                <p className="dashboard-frontdesk__note">
                  {dashboardData.users.length}{" "}
                  {dashboardData.users.length === 1 ? "socio registrado" : "socios registrados"} en total —{" "}
                  {dashboardData.activeUsers.length} activos.
                </p>
              </>
            ) : (
              <EmptyState
                description="Todavia no hay socios registrados en el sistema."
                title="Sin socios"
              />
            )}
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
