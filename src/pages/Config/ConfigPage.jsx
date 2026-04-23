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
  const [settings, setSettings] = useState(() => {
    const defaults = {
      theme: "light", // light | dark | system
      accentColor: "#1d4dff"
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
  }, [resolvedTheme, settings.accentColor]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="config-page">
      <div className="config-header">
        <div>
          <h1 className="config-title">Configuración</h1>
          <p className="config-subtitle">Personaliza la apariencia y tus preferencias.</p>
        </div>
      </div>

      <section className="config-section">
        <div className="config-section__heading">
          <h2>Apariencia</h2>
          <p>El tema se cambia desde la barra superior.</p>
        </div>
      </section>
    </div>
  );
}
