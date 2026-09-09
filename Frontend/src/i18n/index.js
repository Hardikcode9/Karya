import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import bn from "./locales/bn.json";
import mr from "./locales/mr.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import pa from "./locales/pa.json";

// Adding a new language: drop a locale/xx.json here (any subset of keys —
// missing keys automatically fall back to English) and add it to this list
// plus `languageOptions` in LanguageContext.
export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  mr: { translation: mr },
  ta: { translation: ta },
  te: { translation: te },
  pa: { translation: pa },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "karya-language",
    },
  });

export default i18n;
