/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton, Tooltip, Button, TextField } from "@material-ui/core";
import { getTranslations as t } from "../../locales";
import FileCopyIcon from "@material-ui/icons/FileCopy";
let QRCode = require("qrcode.react");

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
    marginBottom: 20,
  },
  topScrollPaper: {
    alignItems: "start",
    marginTop: "10vh",
  },
  topPaperScrollBody: {
    verticalAlign: "middle",
  },
}));

const QuickResponseCode = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  let url = window.location.origin + "/?tab=encryption&publicKey=" + props.publicKey;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t("generate_qr_code")} placement="bottom">
        <IconButton onClick={handleClickOpen}>
          <img
            alt="qr-code"
            style={{ width: "1em", height: "1em" }}
            src={
              "data:image/png;base64,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"
            }
          />
        </IconButton>
      </Tooltip>

      <Dialog
        scroll="body"
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          elevation: 0,
        }}
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <DialogTitle id="alert-dialog-title" />
        <DialogContent>
          <div className={classes.form}>
            <QRCode
              value={url}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"M"}
              includeMargin={true}
              renderAs={"canvas"}
              imageSettings={{
                src: "/assets/icons/qr-logo.png",
                x: null,
                y: null,
                height: 40,
                width: 40,
                excavate: false,
              }}
            />
          </div>

          <DialogContentText>
            <small>* {t("qr_code_note_one")}</small>
            <br />
            <small>* {t("qr_code_note_two")}</small>
            <br />
            <small>* {t("qr_code_note_three")}</small>
          </DialogContentText>

          {url && (
            <TextField
              style={{ marginTop: 15 }}
              defaultValue={url != undefined ? url : url}
              InputProps={{
                readOnly: true,
                classes: {
                  root: classes.textFieldRoot,
                  focused: classes.textFieldFocused,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
                endAdornment: (
                  <>
                    <Tooltip title={t('copy_link')} placement="left">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                        }}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ),
              }}
              helperText={t("create_shareable_link_note")}
              variant="outlined"
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuickResponseCode;
