/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Link from "@material-ui/core/Link";
import { Chip, Avatar, Hidden } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IconButton, Tooltip, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
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
    borderRadius: 8,
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

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`donation-tabpanel-${index}`}
      aria-labelledby={`donation-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
};
