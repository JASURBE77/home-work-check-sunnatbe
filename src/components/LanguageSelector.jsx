import React from "react";
import { FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const currentLang = localStorage.getItem("lang") || "uz";

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn bg-blue-600 border-none rounded-xl text-white gap-2">
        <FiGlobe className="text-lg" />
        {currentLang === "uz" ? "O'zbekcha" : "Русский"}
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-45"
      >
        <li>
          <button onClick={() => changeLanguage("uz")}>🇺🇿 O'zbekcha</button>
        </li>
        <li>
          <button onClick={() => changeLanguage("ru")}>🇷🇺 Русский <span className="badge bg-red-500 text-white">BETA</span></button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSelector;
