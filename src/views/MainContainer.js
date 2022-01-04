import { makeStyles } from "@material-ui/core/styles";
import NavAppBar from "../components/AppBar";
import Hero from "../components/Hero";
import Panels from "../components/Panels";
import Footer from "../components/Footer";
import CheckMultipleTabs from "../config/CheckMultipleTabs";


const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.alabaster.main,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}))

const MainContainer = () => {

  const classes = useStyles();

  return (
    <div className={classes.body}>
      <CheckMultipleTabs />
      <NavAppBar />
      <Hero />
      <Panels />
      <Footer />
    </div>
  );
};

export default MainContainer;
