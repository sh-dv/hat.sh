import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Cookies from "universal-cookie";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Button, Hidden } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { supportedLocales } from "../../next-i18next.config";

// https://nextjs.org/docs/advanced-features/i18n-routing#leveraging-the-next_locale-cookie
const setLocaleCookie = (locale) => {
  const cookies = new Cookies();
  cookies.set("NEXT_LOCALE", locale, { path: "/" });
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const Language = () => {
  const router = useRouter();
  const classes = useStyles();

  const { t } = useTranslation();
  const { pathname, asPath, query, locale } = router;

  const [showSaveBtn, setShowSaveBtn] = useState(false);

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    console.log(language);
    setLocaleCookie(language);
    router.push({ pathname, query }, asPath, { locale: language });

    setShowSaveBtn(true);
  };

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel>{t("language")}</InputLabel>
        <Select
          value={locale}
          onChange={handleLanguageChange}
          label={t("language")}
        >
          {Object.entries(supportedLocales).map(([code, name]) => (
            <MenuItem key={code} value={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showSaveBtn ? (
        <Alert className={classes.formControl}>{t("language_changed")}</Alert>
      ) : (
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
      )}
    </>
  );
};

export default Language;
