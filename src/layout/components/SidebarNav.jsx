import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Icon } from "../../components/Icon/Icon";
import { useT } from "../../i18n/useT";
import { classNames } from "../../utils/classNames";
import { navigationItems } from "../navigationItems";

export function SidebarNav({ isOpen, onClose }) {
  const { logout } = useAuth();
  const t = useT();

  const labelsByPath = {
    "/": t.panel,
    "/usuarios": t.usuarios,
    "/profesores": t.monitores,
    "/actividades": t.actividades,
    "/configuracion": t.configuracion
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

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
          aria-label="Cerrar navegacion"
          className="sidebar__close"
          onClick={onClose}
          type="button"
        >
          <Icon name="close" size={18} />
        </button>

        <div className="sidebar__content">
          <div className="sidebar__brand">
            <img alt="TenFit" className="sidebar__brand-logo" src="/logo.png" />
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
                <span>{labelsByPath[item.path] || item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar__footer">
          <button className="sidebar__footer-link" onClick={handleLogout} type="button">
            <Icon name="logout" size={18} />
            <span>{t.cerrarSesion}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
