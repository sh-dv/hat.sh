/* eslint-disable @next/next/no-img-element */
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  heroTitle: {
    color: "#9791a1",
    marginTop: 20,
  },
  heroSubTitle: {
    color: "#9791a1",
  },
});

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
        Hat.sh v2 is here{" "}
        <img alt="👋" src="/assets/images/wavinghand.png" width="24" />
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        component="p"
        className={classes.heroSubTitle}
      >
        simple, fast, secure client-side file encryption
        <br />
      </Typography>
    </Container>
  );
}
