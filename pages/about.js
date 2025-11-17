/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import fs from "fs";
import path from "path";
import { marked } from "marked";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "../src/components/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Footer from "../src/components/Footer";
import prism from "prismjs";
import { ThemeProvider } from "@material-ui/styles";
import { Theme, checkTheme } from "../src/config/Theme";
import locales from "../locales/locales";
import { getTranslations as t } from "../locales";

marked.setOptions({
  highlight: function (code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

export default function About(props) {
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
        if (langFilter[key] !== obj[key]) matches = false;
      }
      if (matches) langResult = obj;
      else setDocContent(languages[0].content); // default en
    });

    if (langResult && langResult.content) setDocContent(langResult.content);
  }, [props.docs]);

  return (
    <ThemeProvider theme={Theme}>
      <div style={{ backgroundColor: "#000000", minHeight: "100vh", color: "#00ff00" }}>
        <CssBaseline />
        <AppBar /> {/* Nuestro AppBar con botones verdes */}
        <Container maxWidth="lg" style={{ paddingTop: "100px" }}>
          <div dangerouslySetInnerHTML={{ __html: marked(docContent) }}></div>
          <div dangerouslySetInnerHTML={{ __html: marked(props.changelog) }}></div>
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

About.propTypes = {
  window: PropTypes.func,
};

export async function getStaticProps() {
  let docs = [];

  Object.entries(locales).map(([code]) => {
    let docFilePath = `locales/${code}/docs.md`;
    let docFile;
    try {
      docFile = fs.readFileSync(path.join(docFilePath), "utf-8");
    } catch (error) {
      docFile = fs.readFileSync(path.join(`locales/en_US/docs.md`), "utf-8");
    }
    docs.push({ lang: code, content: docFile });
  });

  const changelog = fs.readFileSync("CHANGELOG.md", "utf-8");

  return { props: { docs, changelog } };
}
