import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translations
import en from "./locales/en.json";
import ro from "./locales/ro.json";
import ru from "./locales/ru.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ro: { translation: ro },
    ru: { translation: ru },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if the selected one isn't available
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
