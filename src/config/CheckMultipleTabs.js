import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles((theme) => ({
  topScrollPaper: {
    alignItems: "start",
    marginTop: "20vh",
  },
  topPaperScrollBody: {
    verticalAlign: "middle",
  },
}));

const CheckMultipleTabs = () => {
  const classes = useStyles();
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
