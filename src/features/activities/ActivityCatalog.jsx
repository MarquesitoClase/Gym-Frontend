import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { FloatingActionButton } from "../../components/ui/FloatingActionButton";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildCatalogHighlights,
  mapActivitiesCatalog
} from "../../services/mappers/activitiesMapper";
import { ActivityCard } from "./ActivityCard";

export function ActivityCatalog() {
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
  }, [reloadKey]);

  const catalogHighlights = useMemo(
    () => buildCatalogHighlights(activities, teachers, requestState),
    [activities, requestState, teachers]
  );
  const activitiesCatalog = useMemo(
    () => mapActivitiesCatalog(activities, teachers),
    [activities, teachers]
  );

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
        <ActivityCard activity={activity} key={activity.id} />
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
    <div className="activities-layout">
      <SurfaceCard className="activities-summary">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Informacion del catalogo</h2>
            <p className="panel-description">
              Indicadores rapidos conectados a las actividades futuras del backend.
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

      <div className="activities-layout__grid">{gridContent}</div>

      <FloatingActionButton
        className="activities-fab"
        disabled
        fixed
        label="Nueva actividad"
      />
    </div>
  );
}
