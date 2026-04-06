import { useState } from "react";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Language from "../config/Language";
import { DarkMode } from "../config/Theme";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles()((theme) => ({
  topScrollPaper: {
    alignItems: "start",
    marginTop: "20vh",
  },
  topPaperScrollBody: {
    verticalAlign: "middle",
  },
}));

const Settings = () => {
  const { classes } = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <SettingsIcon />
      </IconButton>

      <Dialog
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
        <DialogTitle id="alert-dialog-title">{t('settings')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('change_language')} :
          </DialogContentText>

          <Language />

          <DialogContentText
            id="alert-dialog-description"
            style={{ marginTop: 15 }}
          >
            {t('change_appearance')} :
          </DialogContentText>

          <DarkMode />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Settings;
