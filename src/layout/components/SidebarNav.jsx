import { NavLink } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { classNames } from "../../utils/classNames";
import { navigationItems } from "../navigationItems";

export function SidebarNav({ isOpen, onClose }) {
  return (
    <>
      <button
        aria-label="Cerrar navegacion"
        className={classNames("app-overlay", isOpen && "is-visible")}
        onClick={onClose}
        type="button"
      />
      <aside className={classNames("sidebar", isOpen && "is-open")}>
        <button
          aria-label="Cerrar navegación"
          className="sidebar__close"
          onClick={onClose}
          type="button"
        >
          <Icon name="close" size={18} />
        </button>

        <div className="sidebar__content">
          <div className="sidebar__brand">
            <div className="sidebar__brand-title">Titan Gym</div>
            <div className="sidebar__brand-subtitle">Terminal de administración</div>
          </div>

          <nav className="sidebar__nav">
            {navigationItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  classNames("sidebar__link", isActive && "is-active")
                }
                end={item.end}
                key={item.path}
                onClick={onClose}
                to={item.path}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar__footer">
          <NavLink className="sidebar__quick-link" onClick={onClose} to="/inscripciones">
            <Icon name="plus" size={18} />
            <span>Inscripción rápida</span>
          </NavLink>
          <button className="sidebar__footer-link" type="button">
            <Icon name="settings" size={18} />
            <span>Configuración</span>
          </button>
          <button className="sidebar__footer-link" type="button">
            <Icon name="logout" size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
