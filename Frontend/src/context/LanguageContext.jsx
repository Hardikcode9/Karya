import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { languageOptions } from "../constants/languages";
import { LanguageContext } from "./contexts";
import { changeGoogleTranslate } from "../utils/googleTranslate";

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(() => {
    return localStorage.getItem("karya-language") || i18n.language || "en";
  });

  useEffect(() => {
    const saved = localStorage.getItem("karya-language") || i18n.language || "en";
    setCurrent(saved);
    if (saved && saved !== "en") {
      changeGoogleTranslate(saved);
    }
  }, [i18n.language]);

  const setLanguage = (code) => {
    setCurrent(code);
    try {
      localStorage.setItem("karya-language", code);
    } catch (e) {
      // Ignore localStorage errors
    }
    i18n.changeLanguage(code);
    changeGoogleTranslate(code);
  };

  return (
    <LanguageContext.Provider
      value={{ current, setLanguage, languageOptions }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
