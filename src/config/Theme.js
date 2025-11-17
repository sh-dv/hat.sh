import { createTheme } from "@material-ui/core/styles";
import { FormControlLabel, Switch } from "@material-ui/core";
import { useState } from "react";
import { getTranslations as t } from "../../locales";

export const Theme = createTheme({
  palette: {
    primary: { main: "#00ff00" }, // Verde Matrix
    background: { default: "#000000" }, // Fondo negro
    text: { primary: "#00ff00", secondary: "#00ff00" }, // Texto verde
    white: { main: "#ffffff" },
    alabaster: { main: "#000000", dark: "#111111" },
    diamondBlack: { main: "rgba(0, 0, 0, 0.87)" },
    gallery: { main: "#111111" },
    mountainMist: { main: "#00ff00", light: "#00ff00" }, // agregado para VersionBadge
    mineShaft: { main: "#00ff00" },
    emperor: { main: "#222222" },
    mercury: { main: "#111111", light: "#222222" },
    alto: { main: "#111111", light: "#222222" },
    flower: { main: "#002200", light: "#003300", text: "#00ff00" },
    cottonBoll: { main: "#001100", light: "#002200", text: "#00ff00" },
  },
  typography: {
    fontFamily: "'Courier New', monospace", // estilo terminal
  },
});

export const checkTheme = () => {
  if (typeof window !== "undefined") {
    let darkMode = window.localStorage.getItem("darkTheme");

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (localStorage) {
        if (darkMode != 0) {
          localStorage.setItem("darkTheme", "1");
          document.querySelector("html").classList.add("darkStyle");
        }
      }
    }

    if (darkMode > 0) {
      document.querySelector("html").classList.add("darkStyle");
    }
  }
};

export const DarkMode = () => {
  const [checked, setchecked] = useState(
    document.querySelector("html").classList.contains("darkStyle")
  );

  const changeTheme = () => {
    if (localStorage) {
      if (!checked) {
        localStorage.setItem("darkTheme", "1");
        document.querySelector("html").classList.add("darkStyle");
        setchecked(true);
      } else {
        localStorage.setItem("darkTheme", "0");
        document.querySelector("html").classList.remove("darkStyle");
        setchecked(false);
      }
    }
  };

  return (
    <FormControlLabel
      value="darkModeEnabled"
      control={<Switch color="primary" checked={checked} onChange={() => changeTheme()} />}
      label={t("dark_mode")}
      labelPlacement="start"
    />
  );
};
