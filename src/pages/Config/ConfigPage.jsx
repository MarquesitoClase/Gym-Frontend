import "./ConfigPage.css";
import { useEffect, useMemo, useState } from "react";

const SETTINGS_STORAGE_KEY = "tenfit:settings";

function clamp(numberValue, min, max) {
  return Math.min(max, Math.max(min, numberValue));
}

function normalizeHexColor(value) {
  if (!value) return null;
  const trimmed = value.trim();
  const match = /^#?([0-9a-f]{6})$/i.exec(trimmed);
  return match ? `#${match[1].toLowerCase()}` : null;
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;
  const raw = normalized.replace("#", "");
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }) {
  const to = (v) =>
    clamp(Math.round(v), 0, 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function mixColors(hexA, hexB, weight) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return null;
  const w = clamp(weight, 0, 1);
  return rgbToHex({
    r: a.r * (1 - w) + b.r * w,
    g: a.g * (1 - w) + b.g * w,
    b: a.b * (1 - w) + b.b * w
  });
}

function safeParseSettings(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function ConfigPage() {
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [settings, setSettings] = useState(() => {
    const defaults = {
      theme: "light", // light | dark | system
      accentColor: "#1d4dff",
      density: "comfortable", // comfortable | compact
      language: "es",
      notificationsEmail: true,
      notificationsPush: false,
      marketingEmails: false
    };

    const stored = safeParseSettings(localStorage.getItem(SETTINGS_STORAGE_KEY));
    if (!stored) return defaults;

    return {
      ...defaults,
      ...stored,
      accentColor: normalizeHexColor(stored.accentColor) ?? defaults.accentColor
    };
  });

  const resolvedTheme = useMemo(() => {
    if (settings.theme !== "system") return settings.theme;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, [settings.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;

    const accent = normalizeHexColor(settings.accentColor) ?? "#1d4dff";
    root.style.setProperty("--brand-primary", accent);
    root.style.setProperty("--brand-secondary", mixColors(accent, "#ffffff", 0.08) ?? accent);
    root.style.setProperty("--brand-primary-strong", mixColors(accent, "#000000", 0.18) ?? accent);
    root.dataset.density = settings.density;
  }, [resolvedTheme, settings.accentColor, settings.density]);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setStatus({ type: "success", message: "Preferencias guardadas." });
    window.setTimeout(() => setStatus({ type: "idle", message: "" }), 2200);
  };

  return (
    <div className="config-page">
      <div className="config-header">
        <div>
          <h1 className="config-title">Configuración</h1>
          <p className="config-subtitle">Personaliza la apariencia y tus preferencias.</p>
        </div>
        <div className="config-actions">
          <button className="config-btn config-btn--primary" onClick={handleSave} type="button">
            Guardar cambios
          </button>
        </div>
      </div>

      <section className="config-section">
        <div className="config-section__heading">
          <h2>Apariencia</h2>
          <p>Colores, tema y densidad de la interfaz.</p>
        </div>

        <div className="config-grid">
          <div className="config-field">
            <label htmlFor="settings-theme">Tema</label>
            <select
              id="settings-theme"
              onChange={(e) => setSettings((current) => ({ ...current, theme: e.target.value }))}
              value={settings.theme}
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>

          <div className="config-field">
            <label htmlFor="settings-density">Densidad</label>
            <select
              id="settings-density"
              onChange={(e) => setSettings((current) => ({ ...current, density: e.target.value }))}
              value={settings.density}
            >
              <option value="comfortable">Cómoda</option>
              <option value="compact">Compacta</option>
            </select>
          </div>

          <div className="config-field">
            <label htmlFor="settings-accent">Color principal</label>
            <div className="config-color">
              <input
                aria-label="Color principal"
                id="settings-accent"
                onChange={(e) =>
                  setSettings((current) => ({ ...current, accentColor: e.target.value }))
                }
                type="color"
                value={normalizeHexColor(settings.accentColor) ?? "#1d4dff"}
              />
              <input
                inputMode="text"
                onChange={(e) =>
                  setSettings((current) => ({ ...current, accentColor: e.target.value }))
                }
                placeholder="#1d4dff"
                value={settings.accentColor}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="config-section">
        <div className="config-section__heading">
          <h2>Notificaciones</h2>
          <p>Elige qué avisos quieres recibir.</p>
        </div>

        <div className="config-field config-toggle">
          <div>
            <div className="config-toggle__title">Emails de actividad</div>
            <div className="config-toggle__hint">Altas, bajas y cambios importantes.</div>
          </div>
          <input
            checked={settings.notificationsEmail}
            onChange={(e) =>
              setSettings((current) => ({ ...current, notificationsEmail: e.target.checked }))
            }
            type="checkbox"
          />
        </div>

        <div className="config-field config-toggle">
          <div>
            <div className="config-toggle__title">Notificaciones push</div>
            <div className="config-toggle__hint">Avisos rápidos en el dispositivo.</div>
          </div>
          <input
            checked={settings.notificationsPush}
            onChange={(e) =>
              setSettings((current) => ({ ...current, notificationsPush: e.target.checked }))
            }
            type="checkbox"
          />
        </div>

        <div className="config-field config-toggle">
          <div>
            <div className="config-toggle__title">Comunicaciones comerciales</div>
            <div className="config-toggle__hint">Novedades, consejos y promociones.</div>
          </div>
          <input
            checked={settings.marketingEmails}
            onChange={(e) =>
              setSettings((current) => ({ ...current, marketingEmails: e.target.checked }))
            }
            type="checkbox"
          />
        </div>
      </section>

      <section className="config-section">
        <div className="config-section__heading">
          <h2>Cuenta</h2>
          <p>Preferencias generales del panel.</p>
        </div>

        <div className="config-grid">
          <div className="config-field">
            <label htmlFor="settings-language">Idioma</label>
            <select
              id="settings-language"
              onChange={(e) =>
                setSettings((current) => ({ ...current, language: e.target.value }))
              }
              value={settings.language}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="config-field">
            <label>Estado</label>
            <div
              aria-live="polite"
              className={
                status.type === "success"
                  ? "config-status config-status--ok"
                  : "config-status"
              }
            >
              {status.message || "Sin cambios pendientes."}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
