import { classNames } from "../../utils/classNames";
import { SurfaceCard } from "../SurfaceCard/SurfaceCard";
import "./StatCard.css";

function renderBadge(badge) {
  if (!badge) {
    return null;
  }

  if (typeof badge === "string") {
    return <span className="stat-card__badge">{badge}</span>;
  }

  return badge;
}

export function StatCard({
  badge,
  children,
  className,
  footer,
  icon,
  label,
  meta,
  tone = "neutral",
  value
}) {
  return (
    <SurfaceCard className={classNames("stat-card", `stat-card--${tone}`, className)}>
      {icon || badge ? (
        <div className="stat-card__header">
          {icon ? <div className="stat-card__icon">{icon}</div> : <span />}
          {renderBadge(badge)}
        </div>
      ) : null}

      <div className="stat-card__body">
        {label ? <span className="stat-card__label">{label}</span> : null}
        {value ? <strong className="stat-card__value">{value}</strong> : null}
        {meta ? <span className="stat-card__meta">{meta}</span> : null}
      </div>

      {children || footer ? (
        <div className="stat-card__footer">{children ?? footer}</div>
      ) : null}
    </SurfaceCard>
  );
}
