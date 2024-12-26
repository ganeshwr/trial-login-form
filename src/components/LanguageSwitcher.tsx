// React built-in
import { FC, useState } from "react";

// 3rd party
import { Select } from "rizzui";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

// Helper & misc
import { useGlobalTranslation } from "../utils/useGlobalTranslation";

const options = [
  { label: "English", value: "en" },
  { label: "Netherlands", value: "nl" },
];

interface LanguageOption {
  label: string;
  value: string;
}

const LanguageSwitcher: FC = () => {
  const { i18n } = useGlobalTranslation();
  const defaultLanguage =
    options.find((opt) => opt.value == i18n.language) ?? options[0];
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageOption>(defaultLanguage);

  const handleLanguageChange = (lng: LanguageOption) => {
    setSelectedLanguage(lng);
    i18n.changeLanguage(lng.value);
  };

  return (
    <Select
      prefix={<GlobeAltIcon className="w-4" />}
      className="w-fit"
      options={options}
      value={selectedLanguage}
      onChange={handleLanguageChange}
    />
  );
};

export default LanguageSwitcher;
