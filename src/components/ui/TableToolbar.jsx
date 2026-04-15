import { classNames } from "../../utils/classNames";
import "./TableToolbar.css";

export function TableToolbar({
  actions,
  className,
  description,
  title
}) {
  return (
    <div className={classNames("table-toolbar", className)}>
      <div className="table-toolbar__content">
        {title ? <h2 className="table-toolbar__title">{title}</h2> : null}
        {description ? (
          <p className="table-toolbar__description">{description}</p>
        ) : null}
      </div>

      {actions ? <div className="table-toolbar__actions">{actions}</div> : null}
    </div>
  );
}
