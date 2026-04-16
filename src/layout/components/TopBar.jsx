import { Icon } from "../../components/ui/Icon";

export function TopBar({ onMenuOpen, searchPlaceholder }) {
  return (
    <header className="topbar">
      <div className="topbar__search-group">
        <button
          aria-label="Abrir navegación"
          className="topbar__menu-button"
          onClick={onMenuOpen}
          type="button"
        >
          <Icon name="menu" size={18} />
        </button>

        <label className="topbar__search">
          <span className="topbar__search-icon">
            <Icon name="search" size={18} />
          </span>
          <input
            placeholder={searchPlaceholder ?? "Buscar en Titan Gym..."}
            type="search"
          />
        </label>
      </div>

      <div className="topbar__actions">
        <button
          aria-label="Notificaciones"
          className="topbar__icon-button"
          type="button"
        >
          <span className="topbar__notification-dot" />
          <Icon name="bell" size={18} />
        </button>
        <button aria-label="Ayuda" className="topbar__icon-button" type="button">
          <Icon name="help" size={18} />
        </button>
        <button
          aria-label="Configuración"
          className="topbar__icon-button"
          type="button"
        >
          <Icon name="settings" size={18} />
        </button>

        <div className="topbar__profile">
          <div className="topbar__avatar">
            <span>AU</span>
          </div>
          <div className="topbar__profile-text">
            <span className="topbar__profile-name">Usuario admin</span>
            <span className="topbar__profile-role">Administrador principal</span>
          </div>
        </div>
      </div>
    </header>
  );
}
