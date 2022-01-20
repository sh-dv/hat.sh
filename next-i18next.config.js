const path = require("path");

// Supported languages (locale code) mapped to their respective name
const supportedLocales = {
  en: "English",
  fr: "Français",
  zh_CN: "简体中文",
};

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: Object.keys(supportedLocales),
  },
  localePath: path.resolve("./public/locales"),
  supportedLocales,
};
