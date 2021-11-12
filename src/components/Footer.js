import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },

  footer: {
    textAlign: "center",
    padding: theme.spacing(3, 2),
  },

  heartIcon: {
    fontSize: "15px",
    color: "#e74c3c",
  },

  btcAddr: {
    backgroundColor: "#ebebeb",
    color: "#9791a1",
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">
            built and developed with{" "}
            <FavoriteIcon className={classes.heartIcon} /> by{" "}
            <Link
              href="https://github.com/sh-dv"
              target="_blank"
              rel="noopener"
              color="inherit"
            >
              {"sh-dv"}
            </Link>
            .
          </Typography>
          <Typography variant="body1">
            <Link
              href="bitcoin:bc1qh0lmuj34h2z4kr7j2sx8fegqvvaj35ycdtglw2"
              className={classes.btcAddr}
            >
              {"bc1qh0lmuj34h2z4kr7j2sx8fegqvvaj35ycdtglw2"}
            </Link>
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
