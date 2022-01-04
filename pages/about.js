/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import fs from "fs";
import path from "path";
import { marked } from "marked";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
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
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import StarsIcon from "@material-ui/icons/Stars";
import GetAppIcon from "@material-ui/icons/GetApp";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import HistoryIcon from "@material-ui/icons/History";
import prism from "prismjs";
import Settings from "../src/components/Settings";
import { ThemeProvider } from "@material-ui/styles";
import { Theme, checkTheme } from "../src/config/Theme";
import locales from "../locales/locales";
import { getTranslations as t } from "../locales";
const drawerWidth = 240;

marked.setOptions({
  highlight: function (code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: Theme.palette.alabaster.main,
    minHeight: "100vh",
  },
  drawer: {
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
  appBar: {
    backgroundColor: Theme.palette.alabaster.main,
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
    color: Theme.palette.diamondBlack.main,
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
      color: Theme.palette.mineShaft.main,
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
      color: Theme.palette.mineShaft.main,
      fontSize: "26px",
      paddingTop: 20,
      paddingBottom: 20,
      fontWeight: "700",
    },

    "& h3": {
      color: Theme.palette.mineShaft.main,
      fontSize: "24px",
      paddingTop: 20,
      paddingBottom: 20,
      fontWeight: "700",
    },

    "& a": {
      color: Theme.palette.mineShaft.main,
    },

    "& p": {
      fontSize: "17px",
      color: Theme.palette.mineShaft.main,
      lineHeight: 2,
      "& code": {
        backgroundColor: "#f1f1f1",
        wordWrap: "break-word",
        fontFamily: "inherit",
        paddingRight: 7,
        paddingLeft: 7,
        borderRadius: "3px",
      },
    },

    "& li": {
      padding: 2.5,
      fontSize: "18px",
      color: Theme.palette.mineShaft.main,
      "& a": {
        textDecoration: "none",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #000",
      },
    },

    "& hr": {
      backgroundColor: Theme.palette.mercury.main,
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
        fontFamily: "inherit",
        paddingRight: 7,
        paddingLeft: 7,
        borderRadius: "3px",
      },
    },

    "& ol": {
      paddingLeft: 25,
      paddingBottom: 15,
      fontSize: "16px",
      "& code": {
        backgroundColor: "#f1f1f1",
        wordWrap: "break-word",
        fontFamily: "inherit",
        paddingRight: 7,
        paddingLeft: 7,
        borderRadius: "3px",
      },
    },

    "& pre": {
      background: "rgb(235, 235, 235)",
      padding: "13px",
      marginTop: "-5px",
      marginBottom: "20px",
      lineHeight: "1.3",
      fontSize: "14px",
      borderRadius: "3px",
      overflow: "auto",
      "& code": {
        color: Theme.palette.mineShaft.main,
      },
    },

    "& .codeBox": {
      "& pre": {
        background: "#2E3440",
        "& code": {
          color: "#f8f8f2",
        },
      },
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
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [docContent, setDocContent] = useState("");

  useEffect(() => {
    checkTheme();
  }, []);

  useEffect(() => {
    const getLocale = () => {
      if (typeof window !== "undefined") {
        let language = window.localStorage.getItem("language");
        let userLanguage = navigator.language.replace("-", "_");
        return language ? language : locales[userLanguage] ? userLanguage : "en_US";
      }
    };

    let languages = props.docs;
    let langFilter = { lang: getLocale() };
    let langResult;

    languages.forEach(function (obj) {
      let matches = true;
      for (let key in langFilter) {
        if (langFilter[key] !== obj[key]) {
          matches = false;
        }
      }
      if (matches) {
        langResult = obj;
      } else {
        //default en docs
        setDocContent(languages[0].content);
      }
    });

    const getContent = async () => {
      for (const key in langResult) {
        if (key == "content") {
          setDocContent(langResult[key]);
        }
      }
    };

    getContent();
  }, [props.docs]);

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
          { name: t("introduction"), icon: <BookmarkBorderIcon /> },
          { name: t("features"), icon: <StarsIcon /> },
          { name: t("installation"), icon: <GetAppIcon /> },
          { name: t("usage"), icon: <EmojiObjectsIcon /> },
          { name: t("limitations"), icon: <ErrorOutlineIcon /> },
          { name: t("best_practices"), icon: <VerifiedUserIcon /> },
          { name: t("faq"), icon: <LiveHelpIcon /> },
          { name: t("technical_details"), icon: <MenuBookIcon /> },
          { name: t("changelog"), icon: <HistoryIcon /> },
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

  return (
    <ThemeProvider theme={Theme}>
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
                <a href="/">
                  <img src="/assets/images/logo.png" alt="logo" width="40" />
                </a>
              </Typography>

              <Button color="inherit" href="/" className={classes.button}>
                {t('home')}
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

        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
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

            <div dangerouslySetInnerHTML={{ __html: marked(docContent) }}></div>
            <div
              dangerouslySetInnerHTML={{ __html: marked(props.changelog) }}
            ></div>
          </Container>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
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

  let docs = [];

  {
    Object.entries(locales).map(([code, name]) => {
      let docFilePath = `locales/${code}/docs.md`;
      let docFile;
      try {
        docFile = fs.readFileSync(
          path.join(docFilePath),
          "utf-8"
        );
      } catch (error) {
        docFile = fs.readFileSync(
          path.join(`locales/en_US/docs.md`),
          "utf-8"
        );
      }
      
      let docStructure = { lang: code, content: docFile };
      docs.push(docStructure);
    });
  }

  const changelog = fs.readFileSync("CHANGELOG.md", "utf-8");

  return {
    props: {
      docs: docs,
      changelog: changelog,
    },
  };
}
