import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    supportedLngs: ["en", "hi"],
    fallbackLng: "en",
    detection: {
      order: ["path", "cookie", "htmlTag"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/assets/locales/{{lng}}/translation.json`,
    },
    react: { useSuspense: false },
  });

