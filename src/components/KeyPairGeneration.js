import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { AlertTitle } from "@material-ui/lab";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import { Typography } from "@material-ui/core";
import { Paper, Grid, Tooltip } from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import { TextField } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import { generateAsymmetricKeys } from "../utils/generateAsymmetricKeys";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 35,
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    border: "none",
    color: "#1976d2",
    backgroundColor: "#e3f2fd",
    "&:hover": {
      backgroundColor: "#d0e5f5",
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

const KeysGenerationLabel = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [PublicKey, setPublicKey] = useState();
  const [PrivateKey, setPrivateKey] = useState();

  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const generateKeys = async () => {
    let generated = await generateAsymmetricKeys();
    setPublicKey(generated.publicKey);
    setPrivateKey(generated.privateKey);
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
      <div>
        <Typography
          variant="caption"
          style={{
            float: "right",
            color: "#9791a1",
            cursor: "pointer",
            textDecoration: "underline",
            marginLeft: 4,
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          {"Generate now"}
        </Typography>

        <Typography
          variant="caption"
          style={{ float: "right", color: "#9791a1" }}
        >
          {"Don't have public/private keys?"}
        </Typography>
      </div>

      <div className={classes.root}>
        <Collapse in={open}>
          <Paper elevation={0} className={classes.alertContainer}>
            <Alert
              variant="outlined"
              severity="info"
              style={{ border: "none", marginBottom: "15px" }}
              action={
                <IconButton
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
              <AlertTitle>Public/Private key pair generation:</AlertTitle>
            </Alert>

            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  label="Public Key"
                  value={PublicKey ? PublicKey : ""}
                  InputProps={{
                    readOnly: true,
                    endAdornment: PublicKey && (
                      <Tooltip title="Download Public Key" placement="left">
                        <IconButton
                          onClick={() =>
                            downloadKey(PublicKey, "key.public")
                          }
                        >
                          <GetAppIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                  variant="outlined"
                  style={{ marginBottom: "15px" }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type={showPrivateKey ? "text" : "password"}
                  label="Private Key"
                  value={PrivateKey ? PrivateKey : ""}
                  helperText="Never share your private key to anyone! Only public keys should be exchanged."
                  InputProps={{
                    readOnly: true,
                    endAdornment: PrivateKey && (
                      <>
                        <Tooltip title="Show Private Key" placement="left">
                          <IconButton
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                          >
                            {showPrivateKey ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Download Private Key" placement="left">
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
                  className={classes.button}
                  variant="outlined"
                  startIcon={<CachedIcon />}
                  fullWidth
                  style={{ textTransform: "none" }}
                >
                  Generate Key Pair
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      </div>
    </>
  );
};

export default KeysGenerationLabel;
