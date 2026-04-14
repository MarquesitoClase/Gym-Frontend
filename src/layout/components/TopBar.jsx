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
          <Icon name="search" size={18} />
          <input
            placeholder={searchPlaceholder ?? "Buscar en Titan Gym..."}
            type="search"
          />
        </label>
      </div>

      <div className="topbar__actions">
        <button aria-label="Avisos" className="topbar__icon-button" type="button">
          <span className="topbar__notification-dot" />
          <Icon name="bell" size={18} />
        </button>
        <button
          aria-label="Accesos rápidos"
          className="topbar__icon-button"
          type="button"
        >
          <Icon name="spark" size={18} />
        </button>
        <button
          aria-label="Configuración"
          className="topbar__icon-button"
          type="button"
        >
          <Icon name="settings" size={18} />
        </button>

        <div className="topbar__profile">
          <div className="topbar__avatar">TG</div>
          <div className="topbar__profile-text">
            <span className="topbar__profile-name">Recepción</span>
            <span className="topbar__profile-role">Titan Gym</span>
          </div>
        </div>
      </div>
    </header>
  );
}
