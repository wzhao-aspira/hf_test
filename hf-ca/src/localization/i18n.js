import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { merge } from "lodash";
import baseEN from "./language/base/en.json";
import en from "./language/_default/en.json";
import { isQaEnv } from "../helper/AppHelper";

const languageDetector = {
    type: "languageDetector",
    async: true,
    detect: (cb) => cb("en"),
    init: () => {},
    cacheUserLanguage: () => {},
};

i18n.use(languageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: "v3",
        fallbackLng: "en",
        debug: isQaEnv(),
        resources: {
            en: {
                translation: merge(baseEN, en),
            },
        },
    });

export default i18n;
