// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz from "./translations/uz.json"
import ru from "./translations/ru.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "uz",
    debug: false, // productionda false
    interpolation: {
      escapeValue: false,
    },

resources: {
  uz: { translation: uz },
  ru: { translation: ru }
},
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
