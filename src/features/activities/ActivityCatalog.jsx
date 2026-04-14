import { Icon } from "../../components/ui/Icon";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { ActivityCard } from "./ActivityCard";
import { activitiesCatalog, catalogHighlights } from "./activitiesData";

export function ActivityCatalog() {
  return (
    <div className="activities-layout">
      <SurfaceCard className="activities-summary">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Información del catálogo</h2>
            <p className="panel-description">
              Indicadores rápidos para recepción y gestión diaria.
            </p>
          </div>

          <button className="summary-icon-button" type="button">
            <Icon name="spark" size={18} />
          </button>
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

      <div className="activities-layout__grid">
        {activitiesCatalog.map((activity) => (
          <ActivityCard activity={activity} key={activity.id} />
        ))}
      </div>
    </div>
  );
}
