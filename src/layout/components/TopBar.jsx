import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon/Icon";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "2-digit",
  month: "long"
});

const TIME_FORMATTER = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit"
});

const SETTINGS_STORAGE_KEY = "tenfit:settings";

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function getStoredTheme() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "null");
    const theme = stored?.theme;
    return theme === "dark" || theme === "light" ? theme : "light";
  } catch {
    return "light";
  }
}

export function TopBar({ admin, onLogout, onMenuOpen, searchPlaceholder }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [theme, setTheme] = useState(getStoredTheme);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") ?? "";

  useEffect(() => {
    let intervalId;
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      intervalId = setInterval(() => setNow(new Date()), 60000);
    }, 60000 - (Date.now() % 60000));

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const formattedDate = useMemo(() => capitalize(DATE_FORMATTER.format(now)), [now]);
  const formattedTime = useMemo(() => TIME_FORMATTER.format(now), [now]);

  const handleSearch = (event) => {
    const value = event.target.value;
    const params = new URLSearchParams(location.search);

    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }

    navigate(
      {
        pathname: location.pathname,
        search: params.toString()
      },
      { replace: true }
    );
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

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    try {
      const current = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? "null");
      const next = current && typeof current === "object" ? { ...current, theme } : { theme };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ theme }));
    }
  }, [theme]);

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
        <div aria-label="Fecha y hora" className="topbar__datetime" role="status">
          <span className="topbar__datetime-item">
            <Icon name="calendar" size={16} />
            <span className="topbar__datetime-text">{formattedDate}</span>
          </span>
          <span className="topbar__datetime-divider" aria-hidden="true" />
          <span className="topbar__datetime-item">
            <Icon name="clock" size={16} />
            <span className="topbar__datetime-text topbar__datetime-time">
              {formattedTime}
            </span>
          </span>
        </div>

        <div className="topbar__theme-toggle" role="group" aria-label="Tema">
          <button
            type="button"
            className="topbar__theme-button"
            data-active={theme === "light"}
            aria-pressed={theme === "light"}
            aria-label="Tema claro"
            onClick={() => setTheme("light")}
          >
            <Icon name="sun" size={18} />
          </button>
          <button
            type="button"
            className="topbar__theme-button"
            data-active={theme === "dark"}
            aria-pressed={theme === "dark"}
            aria-label="Tema oscuro"
            onClick={() => setTheme("dark")}
          >
            <Icon name="moon" size={18} />
          </button>
        </div>
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
              <span className="topbar__profile-role">
                {admin?.role ?? "Administrador"}
              </span>
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
                Cerrar sesión
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
