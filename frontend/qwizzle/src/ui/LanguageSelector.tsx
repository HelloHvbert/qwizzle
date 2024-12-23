import { Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English" },
    { code: "pl", name: "Polski" },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  function selectLanguage(langCode: string) {
    setSelectedLanguage(langCode);
    setIsOpen(false);
    console.log(`Language changed to ${langCode}`);
    i18n.changeLanguage(langCode);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-primary-foreground hover:text-primary-foreground/80 flex items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="mr-1 h-5 w-5" />
        <span className="sr-only">Select language</span>
        <span>{selectedLanguage.toUpperCase()}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 rounded-md bg-white py-2 shadow-xl xs:w-full sm:w-48">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className="text-gray-700 hover:text-primary-foreground block w-full px-4 py-2 text-left text-sm hover:bg-primary"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
