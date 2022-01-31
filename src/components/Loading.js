/* eslint-disable @next/next/no-img-element */
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";

const useStyles = makeStyles((theme) => ({
  backDrop: {
    backgroundColor: theme.palette.alabaster.main,
    opacity: "96%",
    zIndex: 10,
    color: theme.palette.mineShaft.main,
  },

  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  circle: {
    position: "absolute",
    width: 250,
    height: 250,
    border: "4px dashed",
    borderRadius: "50%",
    animation: "$spin 5s linear infinite",
  },

  loadingImg: {
    position: "absolute",
    width: 150,
    animation: "$bounce 1.5s linear infinite"
  },

  loadingText: {
    position: "absolute",
    bottom: "15%",
  },

  "@keyframes spin": {
    "100%": {
      transform: "rotateZ(360deg)",
    },
  },

  "@keyframes bounce": {
    "0%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
    "100%": { transform: "translateY(0)" },
  },

}));

const LoadingCom = (props) => {
  const classes = useStyles();
  

  return (
    <Backdrop className={classes.backDrop} open={props.open}>
      <div className={classes.loadingWrapper}>
        <div className={classes.circle}></div>
        <img
          className={classes.loadingImg}
          src="/assets/images/logo.png"
          alt="Loading..."
        />

        <samp className={classes.loadingText}>
            Loading...
        </samp>
      </div>
    </Backdrop>
  );
};

export default LoadingCom;
