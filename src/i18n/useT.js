import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translations } from "./translations";

export function useT() {
  const { language } = useContext(LanguageContext);
  return translations[language] || translations.es;
}
