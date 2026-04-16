import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildCatalogHighlights,
  mapActivitiesCatalog
} from "../../services/mappers/activitiesMapper";
import { ActivityCard } from "./ActivityCard";

export function ActivityCatalog({
  onCreateRequest,
  onEditRequest,
  refreshToken = 0
}) {
  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const [activitiesResponse, teachersResponse] = await Promise.all([
          activitiesService.list(),
          teachersService.list()
        ]);

        if (ignore) {
          return;
        }

        setActivities(activitiesResponse);
        setTeachers(teachersResponse);
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setActivities([]);
        setTeachers([]);
        setErrorMessage(
          getApiErrorMessage(error, "No se pudieron cargar las actividades.")
        );
        setRequestState("error");
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, [reloadKey, refreshToken]);

  const catalogHighlights = useMemo(
    () => buildCatalogHighlights(activities, teachers, requestState),
    [activities, requestState, teachers]
  );
  const activitiesCatalog = useMemo(
    () => mapActivitiesCatalog(activities, teachers),
    [activities, teachers]
  );
  const primaryActivities = activitiesCatalog.slice(0, 4);
  const secondaryActivities = activitiesCatalog.slice(4, 6);

  const handleRetry = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  const gridContent =
    requestState === "loading" ? (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          description="Estamos consultando el backend para traer el catalogo futuro real."
          icon="search"
          title="Cargando actividades"
        />
      </SurfaceCard>
    ) : requestState === "error" ? (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          action={
            <Button onClick={handleRetry} size="sm" variant="secondary">
              Reintentar
            </Button>
          }
          description={errorMessage}
          icon="warning"
          title="No se pudo cargar el catalogo"
        />
      </SurfaceCard>
    ) : activitiesCatalog.length ? (
      activitiesCatalog.map((activity) => (
        <ActivityCard
          activity={activity}
          key={activity.id}
          onEditRequest={onEditRequest}
        />
      ))
    ) : (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          description="Todavia no hay actividades futuras publicadas en el backend."
          title="Sin actividades programadas"
        />
      </SurfaceCard>
    );

  return (
    <div className="activities-catalog">
      <div className="activities-catalog__top">
        {primaryActivities.length
          ? primaryActivities.map((activity) => (
              <ActivityCard
                activity={activity}
                className="activity-card--catalog-top"
                key={activity.id}
                onEditRequest={onEditRequest}
              />
            ))
          : gridContent}
      </div>

      {requestState === "success" && activitiesCatalog.length ? (
        <div className="activities-catalog__bottom">
          <SurfaceCard className="activities-insights">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Insights del catalogo</h2>
                <p className="panel-description">
                  Indicadores operativos sincronizados con las actividades futuras del backend.
                </p>
              </div>
            </div>

            <div className="activities-summary__grid">
              {catalogHighlights.map((item) => (
                <div className="highlight-card" key={item.id}>
                  <span className="highlight-card__label">{item.label}</span>
                  <strong className="highlight-card__value">{item.value}</strong>
                  <span className="highlight-card__meta">{item.meta}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>

          {secondaryActivities.map((activity) => (
            <ActivityCard
              activity={activity}
              className="activity-card--catalog-bottom"
              key={activity.id}
              onEditRequest={onEditRequest}
            />
          ))}
        </div>
      ) : null}

    </div>
  );
}
