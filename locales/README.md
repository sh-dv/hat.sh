# Hat.sh Translation Guide

### In order to add a translation to the app, please follow these steps: 

1. create a folder in the `locales` directory, where the name of this new folder should contain the 2 letter code of the language. (e.g `de` for German language or `nl` for Dutch).
language codes can be found [here](https://gist.github.com/ndbroadbent/588fefab8e0f1b459fcec8181b41b39c).

2. create `index.js` file in the new directory.

3. copy `index.js` content from the `en` (english) folder and edit the code and the content.

4. open `locales/locales.js` file from the locales directory and import the new file like the rest.

5. for the `docs` all you have to do is copy `docs.md` from `en` folder to the new language directory and start editing the content. (e.g `de/docs.md`)

```
Run the app in dev mode to test.
```

## Example:

The original english translation file.

`en/index.js`

```
const en = {
  language_name: "English",
  sub_title: "simple, fast, secure client-side file encryption",
};
export default en;

```

<br>

Copy en file content and create new language folder and file : 

`de/index.js`

```
const de = {
  language_name: "Deutsch",
  sub_title: "Einfache, schnelle, sichere Datenverschlüsselung",
};
export default de;
```

then import the new file in `locales.js`

```
import en from "./en";
import de from "./de";

const locales = {
  en,
  de,
};

export default locales;
```
