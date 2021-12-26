import locales from "./locales";
import en from "./en"; // default locale

const checkLocale = () => {
  if (typeof window !== "undefined") {
    let language = window.localStorage.getItem("language");
    return language ? language : "en";
  }
};

const getTranslations = (key, locale = checkLocale()) => {
  const currLocale = locales[locale] ? locales[locale] : en;
  let translated = currLocale[key] ? currLocale[key] : en[key];
  return translated;
};

export { getTranslations, checkLocale };
