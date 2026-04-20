import { classNames } from "../../utils/classNames";
import "./InfoBanner.css";

const toneClassMap = {
  info: "info-banner--info",
  neutral: "info-banner--neutral",
  success: "info-banner--success",
  warning: "info-banner--warning"
};

export function InfoBanner({
  children,
  className,
  icon,
  title,
  tone = "info"
}) {
  return (
    <div className={classNames("info-banner", toneClassMap[tone], className)}>
      {icon ? <div className="info-banner__icon">{icon}</div> : null}

      <div className="info-banner__content">
        {title ? <strong className="info-banner__title">{title}</strong> : null}
        <div className="info-banner__text">{children}</div>
      </div>
    </div>
  );
}
