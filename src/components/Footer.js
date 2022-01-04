import { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Link from "@material-ui/core/Link";
import { Chip, Avatar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton, Tooltip, TextField } from "@material-ui/core";
import { getTranslations as t } from "../../locales";
let QRCode = require("qrcode.react");

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "auto",
  },

  footer: {
    textAlign: "center",
    color: theme.palette.diamondBlack.main,
    padding: theme.spacing(3, 2),
  },

  heartIcon: {
    fontSize: "15px",
    color: "#e74c3c",
  },

  topScrollPaper: {
    alignItems: "start",
    marginTop: "10vh",
  },
  topPaperScrollBody: {
    verticalAlign: "middle",
  },

  chip: {
    marginTop: 5,
    border: "none",
    textTransform: "none",
    boxShadow: "none",
    color: theme.palette.diamondBlack.main,
    backgroundColor: theme.palette.alto.light,
    "&:hover": {
      backgroundColor: theme.palette.alto.main,
    },
    "&:focus": {
      backgroundColor: theme.palette.alto.main,
      boxShadow: "none",
    },
    transition: "background-color 0.2s ease-out",
    transition: "color .01s",
  },

  monIcon: {
    color: theme.palette.mountainMist.main,
  },

  qr: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
    marginBottom: 20,
  },
}));

export default function Footer() {
  const classes = useStyles();

  const [xmrDialog, setXmrDialog] = useState(false);

  const xmrAddr =
    "84zQq4Xt7sq8cmGryuvWsXFMDvBvHjWjnMQXZWQQRXjB1TgoZWS9zBdNcYL7CRbQBqcDdxr4RtcvCgApmQcU6SemVXd7RuG";

  const handleClickOpen = () => {
    setXmrDialog(true);
  };

  const handleClose = () => {
    setXmrDialog(false);
  };

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">
            built and developed with{" "}
            <strong>
              <FavoriteIcon className={classes.heartIcon} />
            </strong>{" "}
            by{" "}
            <Link
              href="https://github.com/sh-dv"
              target="_blank"
              rel="noopener"
              color="inherit"
            >
              {"sh-dv"}
            </Link>
            .
          </Typography>
          
            <Chip
              size="small"
              className={classes.chip}
              avatar={<Avatar src={"/assets/icons/xmr-logo.png"}></Avatar>}
              label="Monero Accepted"
              clickable
              onClick={() => handleClickOpen()}
              onDelete={() => handleClickOpen()}
              deleteIcon={<MonetizationOnIcon className={classes.monIcon} />}
            />
            <Dialog
              scroll="body"
              maxWidth="sm"
              fullWidth
              open={xmrDialog}
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
              <DialogTitle id="alert-dialog-title">
                {"Monero Donations"}
              </DialogTitle>
              <DialogContent>
                <div className={classes.qr}>
                  <QRCode
                    value={
                      "monero:84zQq4Xt7sq8cmGryuvWsXFMDvBvHjWjnMQXZWQQRXjB1TgoZWS9zBdNcYL7CRbQBqcDdxr4RtcvCgApmQcU6SemVXd7RuG"
                    }
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"M"}
                    includeMargin={true}
                    renderAs={"canvas"}
                    imageSettings={{
                      src: "/assets/icons/xmr-logo.png",
                      x: null,
                      y: null,
                      height: 40,
                      width: 40,
                      excavate: false,
                    }}
                  />
                </div>
                <TextField
                  style={{ marginBottom: 15 }}
                  defaultValue={xmrAddr}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <>
                        <Tooltip title={t("copy_link")} placement="left">
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(xmrAddr);
                            }}
                          >
                            <FileCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
                <DialogContentText id="alert-dialog-description">
                  Hat.sh is an open-source application. The project is
                  maintained in my free time. Donations of any size are
                  appreciated.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {t("close")}
                </Button>
              </DialogActions>
            </Dialog>
        </Container>
      </footer>
    </div>
  );
}
