import { classNames } from "../../utils/classNames";

export function SectionHeader({
  actions,
  className,
  description,
  eyebrow,
  title
}) {
  return (
    <div className={classNames("section-header", className)}>
      <div className="section-header__content">
        {eyebrow ? <span className="section-header__eyebrow">{eyebrow}</span> : null}
        <h1 className="section-header__title">{title}</h1>
        {description ? (
          <p className="section-header__description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="section-header__actions">{actions}</div> : null}
    </div>
  );
}
