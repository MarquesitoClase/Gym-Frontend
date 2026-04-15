import { classNames } from "../../utils/classNames";
import { SurfaceCard } from "./SurfaceCard";

export function MetricCard({ label, meta, tone = "primary", value }) {
  return (
    <SurfaceCard className={classNames("metric-card", `metric-card--${tone}`)}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      <span className="metric-card__meta">{meta}</span>
    </SurfaceCard>
  );
}
