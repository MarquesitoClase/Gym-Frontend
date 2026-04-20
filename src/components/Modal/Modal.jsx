import { useEffect } from "react";
import { classNames } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import "./Modal.css";

export function Modal({
  children,
  className,
  description,
  onClose,
  size = "lg",
  title
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      aria-modal="true"
      className="modal"
      onClick={onClose}
      role="dialog"
    >
      <div
        className={classNames("modal__dialog", `modal__dialog--${size}`, className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div className="modal__header-copy">
            {title ? <h2 className="modal__title">{title}</h2> : null}
            {description ? <p className="modal__description">{description}</p> : null}
          </div>

          <button
            aria-label="Cerrar modal"
            className="modal__close"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
}
