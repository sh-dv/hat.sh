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

  let url =
    window.location.origin + "/?tab=encryption&publicKey=" + props.publicKey;

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
          <svg
            enableBackground="new 0 0 24 24"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <g>
              <rect fill="none" height="24" width="24" />
            </g>
            <g>
              <g>
                <path
                  fill="#6a6a6a"
                  d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z"
                />
              </g>
            </g>
          </svg>
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
              style={{ borderRadius: 8, marginTop:15, boxShadow: "0px 0px 35px 2px rgba(0,0,0,0.2)" }}
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
                    <Tooltip title={t("copy_link")} placement="left">
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
