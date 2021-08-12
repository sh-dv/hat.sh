import { useState, useRef } from "react";
import IdleTimer from "react-idle-timer";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import { Alert } from "@material-ui/lab";
import RefreshIcon from "@material-ui/icons/Refresh";

const IdleTimerContainer = () => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const idleTimerRef = useRef(null);
  const onIdle = () => {
    setSnackBarOpen(true);
    console.log("user is idle");
  };

  return (
    <>
      <IdleTimer ref={idleTimerRef} onIdle={onIdle} timeout={30 * 1000} />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snackBarOpen}
      >
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              <RefreshIcon />
            </Button>
          }
        >
          Idle timeout alert — refresh page!
        </Alert>
      </Snackbar>
    </>
  );
};

export default IdleTimerContainer;
