/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import GitHubIcon from "@material-ui/icons/GitHub";
import VersionBadge from "./VersionBadge";
import Settings from "./Settings";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoWrapper: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  logoImg: {
    width: 120,
    height: "auto",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  rightButtons: {
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
  },
  button: {
    textTransform: "none",
    color: "#00ff00", // Verde forzado
  },
}));

export default function NavAppBar() {
  const classes = useStyles();

  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: "#000000", zIndex: 2000 }}
      elevation={0}
    >
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <div className={classes.logoWrapper}>
            <a href="/">
              <img
                src="/assets/images/candado.jpg"
                alt="logo"
                className={classes.logoImg}
              />
            </a>
            <VersionBadge />
          </div>

          <div className={classes.rightButtons}>
            <Button color="inherit" href="/about/" style={{ color: "#00ff00" }}>
              {t("about")}
            </Button>
            <IconButton
              href="https://github.com/sh-dv/hat.sh"
              target="_blank"
              rel="noopener"
              style={{ color: "#00ff00" }}
            >
              <GitHubIcon />
            </IconButton>
            <Settings style={{ color: "#00ff00" }} />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
