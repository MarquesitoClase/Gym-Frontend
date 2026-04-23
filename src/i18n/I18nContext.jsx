import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, translations } from "./translations";

const SETTINGS_STORAGE_KEY = "tenfit:settings";
const SUPPORTED_CODES = new Set(SUPPORTED_LANGUAGES.map((language) => language.code));

const I18nContext = createContext(null);

function readStoredLanguage() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_LANGUAGE;
    const parsed = JSON.parse(raw);
    const stored = parsed?.language;
    return SUPPORTED_CODES.has(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function persistLanguage(language) {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const current = raw ? JSON.parse(raw) : {};
    const next = current && typeof current === "object" ? { ...current, language } : { language };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ language }));
  }
}

function lookup(dictionary, key) {
  if (!dictionary) return undefined;
  const segments = key.split(".");
  let cursor = dictionary;
  for (const segment of segments) {
    if (cursor && typeof cursor === "object" && segment in cursor) {
      cursor = cursor[segment];
    } else {
      return undefined;
    }
  }
  return typeof cursor === "string" ? cursor : undefined;
}

function format(template, values) {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in values ? String(values[name]) : match
  );
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    persistLanguage(language);
  }, [language]);

  const setLanguage = useCallback((next) => {
    if (SUPPORTED_CODES.has(next)) {
      setLanguageState(next);
    }
  }, []);

  const t = useCallback(
    (key, values) => {
      const dictionary = translations[language] ?? translations[DEFAULT_LANGUAGE];
      const fallback = translations[DEFAULT_LANGUAGE];
      const text = lookup(dictionary, key) ?? lookup(fallback, key) ?? key;
      return format(text, values);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n debe usarse dentro de I18nProvider");
  }
  return ctx;
}
