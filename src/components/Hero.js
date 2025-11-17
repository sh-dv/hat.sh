/* eslint-disable @next/next/no-img-element */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.default, // negro
    padding: "60px 20px",
    borderRadius: 8,
    textAlign: "center",
  },
  heroMainTitle: {
    color: theme.palette.primary.main, // verde Matrix
    marginBottom: 20,
    fontSize: "3rem",
    fontFamily: "'Courier New', monospace",
    fontWeight: "bold",
  },
  heroTitle: {
    color: theme.palette.primary.main, // verde Matrix
    marginBottom: 15,
    fontSize: "2.5rem",
    fontFamily: "'Courier New', monospace",
  },
  heroSubTitle: {
    color: theme.palette.primary.main, // verde Matrix
    fontSize: "1.2rem",
    fontFamily: "'Courier New', monospace",
  },
}));

export default function Hero() {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" component="main" className={classes.heroContent}>
      {/* Título nuevo encima */}
      <Typography variant="h4" className={classes.heroMainTitle} gutterBottom>
        Welcome to Hat.sh GRUPO 2
      </Typography>

      {/* Título original */}
      <Typography variant="h5" className={classes.heroTitle} gutterBottom>
        {"Hat.sh"}
      </Typography>

      {/* Subtítulo */}
      <Typography variant="subtitle1" className={classes.heroSubTitle}>
        {t("sub_title")}
      </Typography>
    </Container>
  );
}
