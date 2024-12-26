// React built-in
import { useEffect } from "react";

// 3rd party
import { useTranslation } from "react-i18next";

// Helper & misc
import ls from "./secureLs";

export const useGlobalTranslation = () => {
  const { t, i18n } = useTranslation();

  // Save language to secure local storage when it changes
  useEffect(() => {
    const currentLanguage = i18n.language;
    ls.set("selectedLanguage", currentLanguage);
  }, [i18n.language]);

  return { t, i18n };
};
