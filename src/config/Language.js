import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button, Hidden } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { checkLocale } from "../../locales";
import { getTranslations as t } from "../../locales";
import locales from "../../locales/locales";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const Language = () => {
  const classes = useStyles();

  const [language, setLanguage] = useState(checkLocale());

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (localStorage) {
      localStorage.setItem("language", e.target.value);
    }
    window.location.reload(true);
  };

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel>{t("language")}</InputLabel>
        <Select
          value={language}
          onChange={handleLanguageChange}
          label={t("language")}
        >
          {Object.entries(locales).map(([code, name]) => (
            <MenuItem key={code} value={code}>
              {name.language_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Hidden xsDown>
        <Alert
          className={classes.formControl}
          severity="info"
          action={
            <Button
              href="https://github.com/sh-dv/hat.sh/blob/master/TRANSLATION.md"
              target="_blank"
            >
              {t("guide")}
            </Button>
          }
        >
          {t("help_translate")}
        </Alert>
      </Hidden>
    </>
  );
};

export default Language;
