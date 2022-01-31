# Hat.sh Translation Guide

### In order to add a translation to the app, please follow these steps: 

1. create a folder in the `locales` directory, where the name of this new folder should contain the code of the language. (e.g `de_DE` for German language or `nl_NL` for Dutch).
language codes can be found [here](https://gist.github.com/ndbroadbent/588fefab8e0f1b459fcec8181b41b39c).

2. create `index.js` file in the new directory.

3. copy `index.js` content from the `en_US` (english) folder and edit the code and the content.

4. open `locales/locales.js` file from the locales directory and import the new file like the rest.

5. for the `docs` all you have to do is copy `docs.md` from `en_US` folder to the new language directory and start editing the content. (e.g `de_DE/docs.md`)

```
Run the app in dev mode to test.
```

## Example:

The original english translation file.

`en_US/index.js`

```
const en_US = {
  language_name: "English",
  sub_title: "simple, fast, secure client-side file encryption",
};
export default en_US;

```

<br>

Copy `en_US` file content and create new language folder and file : 

`de_DE/index.js`

```
const de_DE = {
  language_name: "Deutsch",
  sub_title: "Einfache, schnelle, sichere Client-seitige Dateiverschlüsselung",
};
export default de_DE;
```

then import the new file in `locales.js`

```
import en_US from "./en_US";
import de_DE from "./de_DE";

const locales = {
  en_US,
  de_DE,
};

export default locales;
```
