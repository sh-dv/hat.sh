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
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import StarsIcon from '@material-ui/icons/Stars';
import GetAppIcon from '@material-ui/icons/GetApp';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import HistoryIcon from '@material-ui/icons/History';
import prism from "prismjs";

const drawerWidth = 240;


marked.setOptions({
  highlight: function(code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {},
  drawer: {
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
  appBar: {
    backgroundColor: "#fafafa",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      marginLeft: drawerWidth,
      zIndex: theme.zIndex.drawer - 1,
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
    [theme.breakpoints.up("xl")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    padding: theme.spacing(3),
    marginTop: "20px",

    "& h1": {
      marginTop: 20,
      color: "#3f3f3f",
      borderRadius: "8px",
      paddingBottom: 15,
      "& a": {
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: 40,
        letterSpacing: "1px",
        borderBottom: "1px solid #000",
      },
    },

    "& h2": {
      color: "#3f3f3f",
      fontSize: "26px",
      paddingTop: 20,
      paddingBottom: 20,
      fontWeight: "700",
    },

    "& h3": {
      color: "#3f3f3f",
      fontSize: "24px",
      paddingTop: 20,
      paddingBottom: 20,
      fontWeight: "700",
    },

    "& a": {
      color: "#3f3f3f",
    },

    "& p": {
      fontSize: "17px",
      color: "#3f3f3f",
      lineHeight: 2,
      "& code": {
        backgroundColor: "#f1f1f1",
        wordWrap: "break-word",
      },
    },

    "& li": {
      padding: 2.5,
      fontSize: "18px",
      color: "#3f3f3f",
      "& a": {
        textDecoration: "none",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #000",
      },
    },

    "& hr": {
      backgroundColor: "#e9e9e9",
      border: "none",
      height: "1.5px",
      marginTop: 20,
      marginBottom: 30,
    },

    "& ul": {
      paddingLeft: 25,
      paddingBottom: 15,
      fontSize: "16px",
      "& code": {
        backgroundColor: "#f1f1f1",
        wordWrap: "break-word",
      },
    },

    "& ol": {
      paddingLeft: 25,
      paddingBottom: 15,
      fontSize: "16px",
      "& code": {
        backgroundColor: "#f1f1f1",       
        wordWrap: "break-word",
      },
    },

    "& pre": {
      background: "#2E3440",
      padding: "13px",
      margin: "20px 0",
      lineHeight: "1.3",
      fontSize: "14px",
      color: "#1f1f1f",
      borderRadius: "3px",
      overflow: "auto",
    },

    "& blockquote": {
      backgroundColor: "#f1f1f1",
      marginTop: "15px",
      color: "#535a60",
      borderLeft: "5px solid #c8ccd0",
      marginBottom: 20,
      "& p": {
        padding: 10,
      },
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
          {name: "Introduction", icon: <BookmarkBorderIcon />},
          {name: "Features", icon: <StarsIcon />},
          {name: "Installation", icon: <GetAppIcon />},
          {name: "Usage", icon: <EmojiObjectsIcon />},
          {name: "Limitations", icon: <ErrorOutlineIcon />},
          {name: "Best-Practices", icon: <VerifiedUserIcon />},
          {name: "Technical-Details", icon: <MenuBookIcon />},
          {name: "FAQ", icon: <LiveHelpIcon />},
          {name: "Changelog", icon: <HistoryIcon />},
        ].map((text, index) => (
          <div onClick={handleClose} key={index}>
            <Link href={"#" + text.name.toLowerCase()} passHref>
              <ListItem button>
              <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.name} />
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
              <Link href="#">
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
              href="https://v1.hat.sh"
              target="_blank"
              rel="noopener"
              className={classes.button}
            >
              v1
            </Button>
            <IconButton
              color="inherit"
              href="https://github.com/sh-dv/hat.sh"
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
          <div dangerouslySetInnerHTML={{ __html: marked(props.changelog) }}></div>
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
  const changelog = fs.readFileSync("CHANGELOG.md", "utf-8");

  return {
    props: {
      docs: docs,
      changelog: changelog,
    },
  };
}
