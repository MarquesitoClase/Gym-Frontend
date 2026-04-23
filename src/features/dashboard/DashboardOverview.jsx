import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarCell } from "../../components/AvatarCells/AvatarCell";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Icon } from "../../components/Icon/Icon";
import { LoadingState } from "../../components/LoadingState/LoadingState";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { StatCard } from "../../components/StatCard/StatCard";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard";
import { useT } from "../../i18n/useT";
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

function formatSessionCaption(activity, monitorLabel) {
  return `${monitorLabel} ${activity.teacher}`;
}

export function DashboardOverview() {
  const t = useT();
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
            t.noSePudoConstruirPanel
          )
        );
        setRequestState("error");
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [reloadKey, t.noSePudoConstruirPanel]);

  const metrics = useMemo(
    () =>
      buildDashboardMetrics(dashboardData, requestState, {
        usersActive: t.sociosActivos,
        activeClasses: t.clasesActivas,
        monthlyIncome: t.ingresosMes,
        loadingRealData: t.cargandoDatosReales,
        noBackend: t.sinConexionBackend,
        monthVs: t.vsMesPasado,
        liveNow: t.enDirecto,
        goal50k: t.objetivo50k,
        totalRegistered: t.registradosEnTotal,
        activeInstructors: t.monitoresActivos,
        usersActiveWord: t.usuariosActivos,
        teachersInStaff: t.monitoresEnPlantilla
      }),
    [dashboardData, requestState, t]
  );
  const upcomingActivities = useMemo(
    () =>
      buildUpcomingActivities(dashboardData.activities, dashboardData.teachers, {
        oneEnrolled: t.unInscrito,
        manyEnrolled: t.inscritos,
        monitorPrefix: t.monitorConNumero
      }),
    [dashboardData.activities, dashboardData.teachers, t]
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
              {t.reintentar}
            </Button>
          }
          description={errorMessage}
          icon="warning"
          title={t.noSePudoCargarPanel}
        />
      </SurfaceCard>
    );
  }

  return (
    <div className="dashboard-view">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <h1>{t.motorCinetico}</h1>
          <p>{t.vistaOperativa}</p>
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
                label={t.objetivoMensual}
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
              <h2>{t.proximasActividades}</h2>
            </div>
            <button
              className="dashboard-link-button"
              onClick={() => navigate("/actividades")}
              type="button"
            >
              {t.verActividades}
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
                    <p>{formatSessionCaption(activity, t.monitor)}</p>
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
              description={t.sinSesionesProximasDesc}
              title={t.sinSesionesProximas}
            />
          )}
        </SurfaceCard>

        <div className="dashboard-side">
          <SurfaceCard className="dashboard-quickactions">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>{t.accionesRapidas}</h2>
                <p>{t.accionesRapidasDesc}</p>
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
                  <strong>{t.nuevoSocio}</strong>
                  <span>{t.registrarAlta}</span>
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
                  <strong>{t.nuevaActividad}</strong>
                  <span>{t.publicarClase}</span>
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
                  <strong>{t.inscripcionRapida}</strong>
                  <span>{t.apuntarSocio}</span>
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
                  <strong>{t.nuevoMonitor}</strong>
                  <span>{t.darAltaProfesor}</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="dashboard-frontdesk">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>{t.ultimoSocioRegistrado}</h2>
              </div>
            </div>

            {receptionUser ? (
              <>
                <div className="dashboard-frontdesk__entry">
                  <AvatarCell
                    imageUrl={receptionUser.imageUrl}
                    subtitle={`${t.alta} ${receptionUser.registrationYear ?? t.reciente}`}
                    title={[receptionUser.firstName, receptionUser.lastName].filter(Boolean).join(" ")}
                  />
                  <StatusBadge
                    label={receptionUser.active ? t.activo : t.inactivo}
                    tone={receptionUser.active ? "active" : "inactive"}
                  />
                </div>
                <p className="dashboard-frontdesk__note">
                  {dashboardData.users.length}{" "}
                  {dashboardData.users.length === 1 ? t.socioRegistrado : t.sociosRegistrados} {t.enTotal} -{" "}
                  {dashboardData.activeUsers.length} {t.activos}.
                </p>
              </>
            ) : (
              <EmptyState
                description={t.sinSociosDesc}
                title={t.sinSocios}
              />
            )}
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
