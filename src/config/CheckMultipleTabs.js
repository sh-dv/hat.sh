import { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Alert, AlertTitle } from "@mui/material";
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

const CheckMultipleTabs = () => {
  const { classes } = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let random = Math.round(Math.random() * 36 ** 12);

    if (typeof window !== "undefined") {
      localStorage.setItem("tabId", random);

      window.addEventListener(
        "storage",
        function (e) {
          if (e.key == "tabId") {
            localStorage.setItem("tab", localStorage.getItem("tabId"));
          }
          if (e.key == "tab" && localStorage.getItem("tabId") !== random) {
            handleOpen();
          }
        },
        false
      );
    }
  }, []);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      PaperProps={{
        elevation: 0,
      }}
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >

      <DialogContent>
        <DialogContentText>
          <Alert severity="warning" style={{fontSize: 16}}>
            <AlertTitle style={{fontSize: 20, marginBottom: 15,}}>{t("multiple_tabs_alert")}</AlertTitle>
            {t("multiple_tabs_alert_notice_one")}
            <br />
            {t("multiple_tabs_alert_notice_two")}
            <br />
          </Alert>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t("understand")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckMultipleTabs;
