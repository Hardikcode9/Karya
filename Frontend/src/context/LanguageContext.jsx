import { useTranslation } from "react-i18next";
import { languageOptions } from "../constants/languages";
import { LanguageContext } from "./contexts";

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  const setLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <LanguageContext.Provider
      value={{ current: i18n.language, setLanguage, languageOptions }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
