/* eslint-disable @next/next/no-html-link-for-pages */
import { useState } from "react";
import { makeStyles } from "tss-react/mui";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { Paper, Grid, Tooltip } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { TextField } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { generateAsymmetricKeys } from "../utils/generateAsymmetricKeys";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import { getTranslations as t } from "../../locales";
import QuickResponseCode from "./QuickResponseCode";

const useStyles = makeStyles()((theme) => ({
  root: {
    marginTop: 50,
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  generateNowText: {
    float: "right",
    color: theme.palette.mountainMist.main,
    cursor: "pointer",
    textDecoration: "underline",
    marginLeft: 4,
  },
  caption: {
    float: "right",
    color: theme.palette.mountainMist.main,
  },
  keyCaption: {
    float: "left",
    color: theme.palette.mountainMist.main,
    marginLeft: 4,
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    border: "none",
    color: theme.palette.denim.main,
    backgroundColor: theme.palette.hawkesBlue.light,
    "&:hover": {
      backgroundColor: theme.palette.hawkesBlue.main,
    },
    transition: "background-color 0.2s ease-out",
    transition: "color .01s",
  },
  alertContainer: {
    padding: theme.spacing(3),
    boxShadow: "rgba(149, 157, 165, 0.4) 0px 8px 24px",
    borderRadius: "8px",
  },
}));

const KeysGeneration = (props) => {
  const { classes } = useStyles();
  const [open, setOpen] = useState(false);

  const [PublicKey, setPublicKey] = useState();
  const [PrivateKey, setPrivateKey] = useState();
  const [generateBtnText, setGenerateBtnText] = useState(
    t("generate_key_pair_button")
  );

  const [showPrivateKey, setShowPrivateKey] = useState(false);


  const generateKeys = async () => {
    let generated = await generateAsymmetricKeys();
    setPublicKey(generated.publicKey);
    setPrivateKey(generated.privateKey);
    setGenerateBtnText(t("generate_another_key_pair_button"));
  };

  const downloadKey = (data, filename) => {
    let file = new Blob([data], { type: "text/plain" });

    let a = document.createElement("a"),
      url = URL.createObjectURL(file);

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <>
    {!props.opened &&
      <div>
        <Typography
          variant="caption"
          className={classes.generateNowText}
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("generate_now_button")}
        </Typography>

        <Typography variant="caption" className={classes.caption}>
          {t("key_pair_question")}
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <a href="/about/#why-need-private-key" target="_blank">
            <Typography variant="caption" className={classes.keyCaption}>
              {t('why_need_private_key')}
            </Typography>
          </a>
        </Box>
      </div>
    }
      <div className={classes.root}>
        <Collapse in={open || props.opened}>
          <Paper elevation={0} className={classes.alertContainer}>
            <Alert
              variant="outlined"
              severity="info"
              style={{ border: "none", marginBottom: "15px" }}
              action={
                <IconButton
                  id="closeGenBtn"
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>{t("key_pair_generation_title")}</AlertTitle>
            </Alert>

            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  id="generatedPublicKey"
                  label={t("public_key")}
                  value={PublicKey ? PublicKey : ""}
                  placeholder={t("generate_public_key")}
                  InputProps={{
                    readOnly: true,
                    endAdornment: PublicKey && (
                      <>
                        <QuickResponseCode publicKey={PublicKey} />
                        <Tooltip
                          title={t("download_public_key")}
                          placement="bottom"
                        >
                          <IconButton
                            onClick={() => downloadKey(PublicKey, "key.public")}
                          >
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ),
                  }}
                  variant="outlined"
                  style={{ marginBottom: "15px" }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="generatedPrivateKey"
                  type={showPrivateKey ? "text" : "password"}
                  label={t("private_key")}
                  value={PrivateKey ? PrivateKey : ""}
                  placeholder={t("generate_private_key")}
                  helperText={t("private_key_notice")}
                  InputProps={{
                    readOnly: true,
                    endAdornment: PrivateKey && (
                      <>
                        <Tooltip
                          title={t("show_private_key")}
                          placement="bottom"
                        >
                          <IconButton
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                          >
                            {showPrivateKey ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={t("download_private_key")}
                          placement="bottom"
                        >
                          <IconButton
                            onClick={() =>
                              downloadKey(PrivateKey, "key.private")
                            }
                          >
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ),
                  }}
                  variant="outlined"
                  style={{ marginBottom: "15px" }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  onClick={generateKeys}
                  className={`${classes.button} keyPairGenerateBtn`}
                  variant="outlined"
                  startIcon={PrivateKey && <CachedIcon />}
                  fullWidth
                  style={{ textTransform: "none" }}
                >
                  {generateBtnText}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      </div>
    </>
  );
};

export default KeysGeneration;
