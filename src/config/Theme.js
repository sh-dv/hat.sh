import { createTheme } from "@material-ui/core/styles";
import { FormControlLabel, Switch } from "@material-ui/core";
import { useState } from "react";
import { getTranslations as t } from "../../locales";

export const Theme = createTheme({
  palette: {
    primary: {
      main: "#464653",
    },
    white: {
      main: "#ffffff",
    },

    alabaster: {
      main: "#fafafa",
      dark: "#303030",
    },

    mountainMist: {
      main: "#9791a1",
    },
    gallery: {
      main: "#ebebeb",
    },
    cinnabar: {
      main: "#e74c3c",
    },
    denim: {
      main: "#1976d2",
    },
    hawkesBlue: {
      main: "#d0e5f5",
      light: "#e3f2fd",
    },
    mineShaft: {
      main: "#3f3f3f",
    },
    emperor: {
      main: "#525252",
    },
    mercury: {
      main: "#e9e9e9",
      light: "#f3f3f3",
    },
    alto: {
      main: "#e1e1e1",
      light: "#ebebeb",
    },
    flower: {
      main: "#fdecea",
      light: "#fadbd7",
      text: "#611a15",
    },
    cottonBoll: {
      main: "#e8f4fd",
      light: "#c9e1f2",
      text: "#0d3c61",
    },
    diamondBlack : {
      main: "rgba(0, 0, 0, 0.54)",
    }
  },
});

export const checkTheme = () => {
  
  if (typeof window !== "undefined") {
    let darkMode = window.localStorage.getItem("darkTheme");

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (localStorage) {
        if(darkMode != 0) {
          localStorage.setItem("darkTheme", "1");
          document.querySelector("html").classList.add("darkStyle");
        }
      }
    }

    if (darkMode > 0) {
      document.querySelector("html").classList.add("darkStyle");
    }
  }

}


export const DarkMode = () => {
  const [checked, setchecked] = useState(document.querySelector("html").classList.contains("darkStyle"))

  const changeTheme = () => {
    if (localStorage) {
      if (!checked) {
        localStorage.setItem("darkTheme", "1");
        document.querySelector("html").classList.add("darkStyle");
        setchecked(true)
      } else {
        localStorage.setItem("darkTheme", "0");
        document.querySelector("html").classList.remove("darkStyle");
        setchecked(false)
      }
    }
  };

  return (
    <FormControlLabel
      value="darkModeEnabled"
      control={<Switch color="primary" checked={checked}  onChange={() => changeTheme()} />}
      label={t('dark_mode')}
      labelPlacement="start"
    />
  );
};

