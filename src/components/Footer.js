/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "auto",
  },
  footer: {
    textAlign: "center",
    color: "#00ff00", // verde Matrix
    backgroundColor: "#000000", // fondo negro Matrix
    padding: theme.spacing(3, 2),
    fontFamily: "'Courier New', monospace",
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1" style={{ color: "#00ff00" }}>
            Mejorado por el grupo 2{" "}
            <Link
              href="https://github.com/sh-dv"
              target="_blank"
              rel="noopener"
              style={{ color: "#00ff00", textDecoration: "none" }}
            >
              sh-dv
            </Link>
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
