import { useState, useRef } from "react";
import IdleTimer from "react-idle-timer";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import { Alert } from "@material-ui/lab";
import RefreshIcon from "@material-ui/icons/Refresh";

export const IdleTimerContainer = () => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const idleTimerRef = useRef(null);

  const onIdle = () => {
    // console.log("user is idle");
    setSnackBarOpen(true);
  };

  return (
    <>
      <IdleTimer
        ref={idleTimerRef}
        onIdle={onIdle}
        timeout={30 * 1000}
        crossTab={{
          type: undefined,
          channelName: "idle-timer",
          emitOnAllTabs: true
        }}
      />
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
          Session timeout due to inactivity — Please reload page
        </Alert>
      </Snackbar>
    </>
  );
};
