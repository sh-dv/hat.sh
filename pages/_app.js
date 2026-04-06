/* eslint-disable @next/next/no-sync-scripts */
import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { getTranslations as t } from "../locales";
import "../public/assets/styles/style.css";
import { checkTheme } from "../src/config/Theme";
import createEmotionCache from "../src/createEmotionCache";

//check wether the user prefers/chose dark theme
checkTheme();

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          {"Hat.sh"}
          {" - "}
          {t("sub_title")}
        </title>
        <link rel="icon" href="/favicon.ico" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Encrypt and Decrypt files securely in your browser."
        />
        <meta
          name="Keywords"
          content="encrypt decrypt encryption file-encryption javascript client-side serverless decryption xchcha20 argon2id encryption-decryption webcrypto crypto browser in-browser"
        />
        <meta
          name="theme-color"
          content="#fafafa"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1c1c1c"
          media="(prefers-color-scheme: dark)"
        />
      </Head>

      <Component {...pageProps} />
    </CacheProvider>
  );
}

export default MyApp;
