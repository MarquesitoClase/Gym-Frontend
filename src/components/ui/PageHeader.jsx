import { classNames } from "../../utils/classNames";
import "./PageHeader.css";

export function PageHeader({
  actions,
  breadcrumb = [],
  className,
  description,
  title
}) {
  return (
    <header className={classNames("page-header", className)}>
      <div className="page-header__main">
        {breadcrumb.length ? (
          <nav aria-label="Breadcrumb" className="page-header__breadcrumb">
            {breadcrumb.map((item, index) => (
              <span className="page-header__breadcrumb-item" key={`${item}-${index}`}>
                {index > 0 ? (
                  <span aria-hidden="true" className="page-header__breadcrumb-separator">
                    /
                  </span>
                ) : null}
                <span>{item}</span>
              </span>
            ))}
          </nav>
        ) : null}

        <div className="page-header__content">
          <h1 className="page-header__title">{title}</h1>
          {description ? (
            <p className="page-header__description">{description}</p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </header>
  );
}
