import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { classNames } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

const activityStatusMap = {
  active: {
    label: "Activa",
    tone: "active"
  },
  inactive: {
    label: "Inactiva",
    tone: "inactive"
  }
};

export function ActivityCard({ activity }) {
  const status = activityStatusMap[activity.status];

  return (
    <SurfaceCard className="activity-card">
      <div
        className={classNames(
          "activity-card__cover",
          `activity-card__cover--${activity.coverTone}`
        )}
      >
        <StatusBadge label={status.label} tone={status.tone} />
        <span className="activity-card__cover-tag">{activity.category}</span>
      </div>

      <div className="activity-card__body">
        <div className="activity-card__heading">
          <h3>{activity.title}</h3>
          <strong>{formatCurrency(activity.price)}</strong>
        </div>

        <p className="activity-card__description">{activity.description}</p>

        <div className="activity-card__meta">
          <div className="activity-card__meta-item">
            <Icon name="calendar" size={16} />
            <span>{activity.schedule}</span>
          </div>
          <div className="activity-card__meta-item">
            <Icon name="user" size={16} />
            <span>{activity.teacher}</span>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
