/* eslint-disable @next/next/no-img-element */
import fs from "fs";
import path from "path";
import marked from "marked";
import { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Link from "next/link";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import GitHubIcon from "@material-ui/icons/GitHub";
import Footer from "../src/components/Footer";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {},
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    backgroundColor: "#fafafa",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      marginLeft: drawerWidth,
      zIndex: theme.zIndex.drawer + 1,
    },
  },

  logo: {
    flexGrow: 1,
    marginTop: 5,
  },
  button: {
    textTransform: "none",
    color: "#9791a1",
  },

  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#ebebeb",
    border: "none",
  },
  content: {
    padding: theme.spacing(3),
    marginTop: "20px",

    "& h1": {
      marginTop: 60,
      color: "#3f3f3f",
      fontSize: "30px",
      background: "#ebebeb",
      padding: 15,
      borderRadius: "8px",
    "& a": {
      textDecoration: "none",
      fontWeight: "bold",
    }
    },

    "& h3": {
      color: "#3f3f3f",
      fontSize: "20px",
      padding: 15,
      paddingTop: 20,
      paddingBottom: 20,
    },

    "& a": {
      color: "#3f3f3f",
    },

    "& p": {
      fontSize: "16px",
      padding: 15
    },

    "& hr": {
      backgroundColor: "#e9e9e9",
      border: "none",
      height: "1.5px",
      marginTop: 20,
      marginBottom: 40,
    },

    "& ul": {
      paddingLeft: 25,
      paddingBottom: 15,
      fontSize: "16px",
    },

    "& ol": {
      paddingLeft: 25,
      paddingBottom: 15,
      fontSize: "16px",
    },

    "& pre": {
      background: "#24343c",
      padding: "13px",
      margin: "20px 0",
      lineHeight: "2.3",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      color: "#82aaff",
      borderRadius: "8px",
    },

    "& blockquote": {
      marginTop: "15px",
      color: "#535a60",
      padding: ".8em .8em .8em 1em",
      borderLeft: "5px solid #c8ccd0",
      "& p": {
        padding: 0,
      }
    },
  },
}));

export default function About(props) {
  const window = undefined;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClose = () => {
    mobileOpen ? setMobileOpen(false) : null;
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />

      <List>
        <ListItem button component="a">
          <ListItemText primary="Hat.sh Documentation" />
        </ListItem>
      </List>

      <Divider />
      <List>
        {[
          "Introduction",
          "Features",
          "Installation",
          "Usage",
          "Limitations",
          "Best-Practices",
          "FAQ",
        ].map((text, index) => (
          <div onClick={handleClose} key={index}>
            <Link href={"#" + text.toLowerCase()} passHref>
              <ListItem button>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          </div>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar
        color="transparent"
        position="fixed"
        className={classes.appBar}
        elevation={0}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" className={classes.logo}>
              <Link href="/">
                <a>
                  <img src="/assets/images/logo.png" alt="logo" width="40" />
                </a>
              </Link>
            </Typography>
            <Button color="inherit" href="/" className={classes.button}>
              home
            </Button>
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

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <Container maxWidth="lg">
          <div className={classes.toolbar} />

          <div dangerouslySetInnerHTML={{ __html: marked(props.docs) }}></div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

About.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export async function getStaticProps() {
  // Get files from the posts dir

  const docs = fs.readFileSync(path.join("docs", "docs.md"), "utf-8");

  return {
    props: {
      docs: docs,
    },
  };
}
