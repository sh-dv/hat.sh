/* eslint-disable @next/next/no-sync-scripts */
import Head from "next/head";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from "next-i18next";
import { supportedLocales } from "../next-i18next.config";
import "../public/assets/styles/style.css";
import { checkTheme } from "../src/config/Theme";

//check wether the user prefers/chose dark theme
checkTheme();

function MyApp({ Component, pageProps }) {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <>
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

        <link
          key="x-default"
          href={`${router.pathname}`}
          rel="alternate"
          hrefLang="x-default"
        />

        {Object.entries(supportedLocales).map(([locale], index) => (
          <link
            key={`${locale}-${index}`}
            href={`/${locale}${router.pathname}`}
            rel="alternate"
            hrefLang={locale}
          />
        ))}
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
