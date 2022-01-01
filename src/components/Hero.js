/* eslint-disable @next/next/no-img-element */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles((theme) => ({
  heroTitle: {
    color: theme.palette.diamondBlack.main,
    marginTop: 20,
  },
  heroSubTitle: {
    color: theme.palette.diamondBlack.main,
  },
}));

export default function Hero() {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" component="main" className={classes.heroContent}>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        className={classes.heroTitle}
      >
        {"Hat.sh"}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        component="p"
        className={classes.heroSubTitle}
      >
        {t('sub_title')}
        <br />
      </Typography>
    </Container>
  );
}
