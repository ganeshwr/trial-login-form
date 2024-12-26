// 3rd party
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Helper & misc
import en from "./locales/en.json";
import nl from "./locales/nl.json";
import ls from "./utils/secureLs";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nl: { translation: nl },
  },
  lng: ls.get("selectedLanguage") ?? "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
