/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { makeStyles } from "tss-react/mui";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import VersionBadge from "./VersionBadge";
import Settings from "./Settings";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles()((theme) => ({

  logo: {
    flexGrow: 1,
    marginTop: 10,
  },
  button: {
    textTransform: "none",
    color: theme.palette.diamondBlack.main,
  },
}));

export default function NavAppBar() {
  const { classes } = useStyles();

  return (
    <div>
      <AppBar color="transparent" position="static" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" className={classes.logo}>
              <a href="/">
                <img src="/assets/images/logo.png" alt="logo" width="40" />
              </a>
              <VersionBadge />
            </Typography>

            <Button color="inherit" href="/about/" className={classes.button}>
              {t("about")}
            </Button>

            <IconButton
              href="https://github.com/sh-dv/hat.sh"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>

            <Settings />
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
