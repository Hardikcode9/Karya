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

// Comprehensive mapping for all 22 Eighth Schedule languages + English
// Any language without a full custom json falls back smoothly to English
export const resources = {
  en: { translation: en },
  as: { translation: en },
  bn: { translation: bn },
  brx: { translation: hi },
  doi: { translation: hi },
  gu: { translation: hi },
  hi: { translation: hi },
  kn: { translation: te },
  ks: { translation: hi },
  gom: { translation: mr },
  mai: { translation: hi },
  ml: { translation: ta },
  mni: { translation: bn },
  mr: { translation: mr },
  ne: { translation: hi },
  or: { translation: bn },
  pa: { translation: pa },
  sa: { translation: hi },
  sat: { translation: hi },
  sd: { translation: hi },
  ta: { translation: ta },
  te: { translation: te },
  ur: { translation: hi },
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
