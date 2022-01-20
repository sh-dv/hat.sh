# Hat.sh Translation Guide

### In order to add a translation to the app, please follow these steps:

1. Create a folder in the `public/locales` directory, where the name of this new folder is a valid language code. (e.g `de` for German language or `nl` for Dutch - it is also possible to use country specific language codes, e.g. `en-GB`, `en-US` ). Language codes can be found [here](https://gist.github.com/ndbroadbent/588fefab8e0f1b459fcec8181b41b39c).

2. Copy `common.json` from the `en` (English) folder to the newly created folder and edit the content.

3. Open `next-i18next.config.js` file from the root directory and add an entry to `supportedLocales` variable. Make sure the object key is equal to the language code (the folder name you created).

4. for the `docs` all you have to do is copy `docs.md` from `en` folder to the new language directory and start editing the content. (e.g `de/docs.md`)

```
Run the app in dev mode to test.
```

## Example:

The original english translation file.

`en/common.json`

```
{
  "sub_title": "simple, fast, secure client-side file encryption",
}
```

<br>

Copy `en/common.json` file content and create new language folder and file (or copy whole `en` folder and rename):

`de/common.json`

```
{
  "sub_title": "einfache, schnelle und sichere client-seitige Dateiverschlüsselung",
}
```

then edit `next-i18next.config.js`

```

const supportedLocales = {
  en: "English",
  fr: "Français",
  zh_CN: "简体中文",
  de: "Deutsch",
};
```
