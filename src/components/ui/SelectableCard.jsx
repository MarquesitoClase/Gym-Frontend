import { classNames } from "../../utils/classNames";
import "./SelectableCard.css";

export function SelectableCard({
  children,
  className,
  footer,
  icon,
  meta,
  onClick,
  selected = false,
  subtitle,
  title,
  trailing,
  type = "button",
  ...props
}) {
  return (
    <button
      className={classNames("selectable-card", selected && "is-selected", className)}
      onClick={onClick}
      type={type}
      {...props}
    >
      {icon || trailing ? (
        <div className="selectable-card__header">
          {icon ? <div className="selectable-card__icon">{icon}</div> : <span />}
          {trailing ? <div className="selectable-card__trailing">{trailing}</div> : null}
        </div>
      ) : null}

      <div className="selectable-card__body">
        {title ? <strong className="selectable-card__title">{title}</strong> : null}
        {subtitle ? <span className="selectable-card__subtitle">{subtitle}</span> : null}
        {meta ? <span className="selectable-card__meta">{meta}</span> : null}
      </div>

      {children ? <div className="selectable-card__content">{children}</div> : null}
      {footer ? <div className="selectable-card__footer">{footer}</div> : null}
    </button>
  );
}
