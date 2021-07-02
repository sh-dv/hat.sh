import { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles({
  whatsNewBtn: {
    textTransform: "none",
    marginTop: 20,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: ".25rem",
    backgroundColor: "#464653",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#000",
    },
  },

  DialogContent: {
    backgroundColor: "#fafafa",
  },

  DialogContentText: {
    color: "#3f3f3f",
  },

  textPink: {
    color: "#d63384",
  },
  listing: {
    padding: 10,
  },
});

export default function WhatsNew() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Button
        onClick={handleClickOpen("paper")}
        className={classes.whatsNewBtn}
      >
        {"What's New?"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{"What's New?"}</DialogTitle>
        <DialogContent
          dividers={scroll === "paper"}
          className={classes.DialogContent}
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            className={classes.DialogContentText}
          >
            <strong>
              Memory efficient large file chunked encryption using streams with
              libsodium.js 🎉
            </strong>
            <p className={classes.listing}>
              - switching to{" "}
              <code className={classes.textPink}>xchacha20poly1305</code> for
              symmetric stream encryption and{" "}
              <code className={classes.textPink}>Argon2id</code> for
              password-based key derivation. instead of AES-256-GCM and PBKDF2.
            </p>

            <p className={classes.listing}>
              - using the libsodium library for all cryptography instead of the
              WebCryptoApi.
            </p>

            <strong>How this new version is different?</strong>
            <p className={classes.listing}>
              - in this version, the app {"doesn't"} read the whole file in
              memory. instead, {"it's"} sliced into 64MB chunks that are
              processed one by one.
            </p>

            <p className={classes.listing}>
              - since we are not using any server-side processing, the app
              registers a fake download URL{" "}
              <code className={classes.textPink}>(/file)</code> that is going to
              be handled by the service-worker fetch api.
            </p>

            <p className={classes.listing}>
              - if all validations are passed, a new stream is initialized.
              then, file chunks are transferred from the main app to the
              service-worker file via messages.
            </p>

            <p className={classes.listing}>
              - each chunk is encrypted/decrypted on {"it's"} own and added to
              the stream.
            </p>

            <p className={classes.listing}>
              - after each chunk is written on disk it is going to be
              immediately garbage collected by the browser, this leads to never
              having more than a few chunks in the memory at the same time.
            </p>

            <strong>ToDos 👨‍💻 :</strong>

            <p className={classes.listing}>
              - handle stream back pressures.
              
            </p>

            <strong>projected release date : 1/9/2021</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Got it</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
