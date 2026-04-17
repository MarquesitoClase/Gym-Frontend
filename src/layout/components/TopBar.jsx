import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";

export function TopBar({ admin, onLogout, onMenuOpen, searchPlaceholder }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Reset search when route changes
  useEffect(() => {
    setQuery("");
  }, [location.pathname]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  useEffect(() => {
    if (!isProfileOpen) {
      return undefined;
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

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
            onChange={handleSearch}
            placeholder={searchPlaceholder ?? "Buscar en TenFit..."}
            type="search"
            value={query}
          />
        </label>
      </div>

      <div className="topbar__actions">
        <div className="topbar__profile-wrapper" ref={dropdownRef}>
          <button
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            className="topbar__profile"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            type="button"
          >
            <div className="topbar__avatar">
              <span>{admin?.initials ?? "AT"}</span>
            </div>
            <div className="topbar__profile-text">
              <span className="topbar__profile-name">{admin?.name ?? "Admin"}</span>
              <span className="topbar__profile-role">{admin?.role ?? "Administrador"}</span>
            </div>
            <Icon name="chevron" size={14} />
          </button>

          {isProfileOpen ? (
            <div className="topbar__dropdown">
              <div className="topbar__dropdown-header">
                <div className="topbar__dropdown-avatar">
                  <span>{admin?.initials ?? "AT"}</span>
                </div>
                <div>
                  <strong className="topbar__dropdown-name">{admin?.name}</strong>
                  <span className="topbar__dropdown-email">{admin?.email}</span>
                  <span className="topbar__dropdown-role">{admin?.role}</span>
                </div>
              </div>
              <div className="topbar__dropdown-divider" />
              <button
                className="topbar__dropdown-logout"
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout?.();
                }}
                type="button"
              >
                <Icon name="logout" size={16} />
                Cerrar sesion
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
