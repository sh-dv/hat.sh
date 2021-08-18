/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import GitHubIcon from "@material-ui/icons/GitHub";
import VersionBadge from "./VersionBadge";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    flexGrow: 1,
    marginTop: 10,
  },
  button: {
    textTransform: "none",
    color: "#9791a1",
  },
}));

export default function NavAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar color="transparent" position="static" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" className={classes.logo}>
              <Link href="/">
                <a>
                  <img src="/assets/images/logo.png" alt="logo" width="40" />
                </a>
              </Link>
              <VersionBadge />
            </Typography>
            
            <Link href="/about" passHref>
              <Button color="inherit" className={classes.button}>
                about
              </Button>
            </Link>

            <Button
              color="inherit"
              href="https://hat.sh"
              target="_blank"
              rel="noopener"
              className={classes.button}
            >
              v1
            </Button>
            <IconButton
              color="inherit"
              href="https://github.com/sh-dv/hat.sh/tree/v2-beta"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
