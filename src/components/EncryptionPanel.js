/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { formatBytes } from "../helpers/formatBytes";
import { formatUrl } from "../helpers/formatUrl";
import KeyPairGeneration from "./KeyPairGeneration";
import { generatePassword } from "../utils/generatePassword";
import { computePublicKey } from "../utils/computePublicKey";
import passwordStrengthCheck from "../utils/passwordStrengthCheck";
import { CHUNK_SIZE } from "../config/Constants";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import IconButton from "@material-ui/core/IconButton";
import CachedIcon from "@material-ui/icons/Cached";
import Tooltip from "@material-ui/core/Tooltip";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Snackbar from "@material-ui/core/Snackbar";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RefreshIcon from "@material-ui/icons/Refresh";
import DescriptionIcon from "@material-ui/icons/Description";
import GetAppIcon from "@material-ui/icons/GetApp";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LinkIcon from "@material-ui/icons/Link";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { getTranslations as t } from "../../locales";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  stepper: {
    color: theme.palette.mineShaft.main,
    backgroundColor: "transparent",
  },

  stepIcon: {
    "&$activeStepIcon": {
      color: theme.palette.emperor.main,
    },
    "&$completedStepIcon": {
      color: theme.palette.emperor.main,
    },
  },
  activeStepIcon: {},
  completedStepIcon: {},

  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    border: "none",
    color: theme.palette.mineShaft.main,
    backgroundColor: theme.palette.mercury.light,
    "&:hover": {
      backgroundColor: theme.palette.mercury.main,
    },
    transition: "background-color 0.2s ease-out",
    transition: "color .01s",
  },

  browseButton: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    textTransform: "none",
    borderRadius: "8px",
    border: "none",
    color: theme.palette.mineShaft.main,
    backgroundColor: theme.palette.alto.light,
    "&:hover": {
      backgroundColor: theme.palette.alto.main,
    },
    transition: "background-color 0.2s ease-out",
    transition: "color .01s",
  },

  backButton: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    backgroundColor: theme.palette.mercury.main,
    transition: "color .01s",
  },
  nextButton: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white.main,
    "&:hover": {
      backgroundColor: theme.palette.mineShaft.main,
    },
    transition: "color .01s",
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
    boxShadow: "rgba(149, 157, 165, 0.4) 0px 8px 24px",
    borderRadius: "8px",
  },

  input: {
    display: "none",
  },

  textFieldLabel: {
    // this will be applied when input focused (label color change)
    "&$textFieldLabelFocused": {
      color: theme.palette.emperor.main,
    },
  },
  textFieldLabelFocused: {},

  textFieldRoot: {
    // this will be applied when hovered (input text color change)
    "&:hover": {
      color: theme.palette.emperor.main,
    },
    // this will applied when hovered (input border color change)
    "&:hover $textFieldNotchedOutline": {
      borderColor: theme.palette.emperor.main,
    },
    // this will be applied when focused (input border color change)
    "&$textFieldFocused $textFieldNotchedOutline": {
      borderColor: theme.palette.emperor.main,
    },
  },
  textFieldFocused: {},
  textFieldNotchedOutline: {},

  fileArea: {
    padding: "20px",
    border: "5px dashed",
    borderColor: theme.palette.gallery.main,
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: "10px",
  },
}));

let file, index;

export default function EncryptionPanel() {
  const classes = useStyles();

  const router = useRouter();

  const query = router.query;

  const [activeStep, setActiveStep] = useState(0);

  const [File, setFile] = useState();

  const [Password, setPassword] = useState();

  const [showPassword, setShowPassword] = useState(false);

  const [PublicKey, setPublicKey] = useState();

  const [PrivateKey, setPrivateKey] = useState();

  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const [wrongPublicKey, setWrongPublicKey] = useState(false);

  const [wrongPrivateKey, setWrongPrivateKey] = useState(false);

  const [keysError, setKeysError] = useState(false);

  const [keysErrorMessage, setKeysErrorMessage] = useState();

  const [encryptionMethod, setEncryptionMethod] = useState("secretKey");

  const [isDownloading, setIsDownloading] = useState(false);

  const [shareableLink, setShareableLink] = useState();

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState();

  const [pkAlert, setPkAlert] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFile) => {
      handleFileInput(acceptedFile[0]);
    },
    noClick: true,
    noKeyboard: true,
    disabled: activeStep !== 0,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setWrongPublicKey(false);
    setWrongPrivateKey(false);
    setKeysError(false);
  };

  const handleRadioChange = (e) => {
    setEncryptionMethod(e.target.value);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile();
    setPassword();
    setPublicKey();
    setPrivateKey();
    setWrongPublicKey(false);
    setWrongPrivateKey(false);
    setKeysError(false);
    setIsDownloading(false);
    setShareableLink();
    setSnackBarMessage();
    file = null;
    index = null;
    router.replace(router.pathname);
  };

  const showSnackBar = () => {
    setSnackBarOpen(!snackBarOpen);
  };

  const handleMethodStep = () => {
    if (encryptionMethod === "secretKey") setActiveStep(2);
    if (encryptionMethod === "publicKey") {
      navigator.serviceWorker.ready.then((reg) => {
        let mode = "test";
        let privateKey = PrivateKey;
        let publicKey = PublicKey;

        reg.active.postMessage({
          cmd: "requestEncKeyPair",
          privateKey,
          publicKey,
          mode,
        });
      });
    }
  };

  const generatedPassword = async () => {
    let generated = await generatePassword();
    setPassword(generated);
  };

  const handleFileInput = (selectedFile) => {
    file = selectedFile;
    setFile(selectedFile);
  };

  const handlePasswordInput = (selectedPassword) => {
    setPassword(selectedPassword);
  };

  const handlePublicKeyInput = (selectedKey) => {
    setPublicKey(selectedKey);
    setWrongPublicKey(false);
  };

  const loadPublicKey = (file) => {
    if (file) {
      // files must be of text and size below 1 mb
      if (file.size <= 1000000) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          setPublicKey(reader.result);
        };
        setWrongPublicKey(false);
      }
    }
  };

  const handlePrivateKeyInput = (selectedKey) => {
    setPrivateKey(selectedKey);
    setWrongPrivateKey(false);
  };

  const loadPrivateKey = (file) => {
    if (file) {
      // files must be of text and size below 1 mb
      if (file.size <= 1000000) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          setPrivateKey(reader.result);
        };
        setWrongPrivateKey(false);
      }
    }
  };

  const handleEncryptedFileDownload = async (e) => {
    let safeUrl = await formatUrl(File.name + ".enc");
    e.target.setAttribute("href", "/file?name=" + safeUrl);
    setIsDownloading(true);

    if (encryptionMethod === "secretKey") {
      navigator.serviceWorker.ready.then((reg) => {
        let password = Password;
        reg.active.postMessage({ cmd: "requestEncryption", password });
      });
    }

    if (encryptionMethod === "publicKey") {
      navigator.serviceWorker.ready.then((reg) => {
        let mode = "derive";
        let privateKey = PrivateKey;
        let publicKey = PublicKey;

        reg.active.postMessage({
          cmd: "requestEncKeyPair",
          privateKey,
          publicKey,
          mode,
        });
      });
    }
  };

  const startEncryption = (method) => {
    navigator.serviceWorker.ready.then((reg) => {
      file
        .slice(0, CHUNK_SIZE)
        .arrayBuffer()
        .then((chunk) => {
          index = CHUNK_SIZE;

          if (method === "secretKey") {
            reg.active.postMessage(
              { cmd: "encryptFirstChunk", chunk, last: index >= file.size },
              [chunk]
            );
          }
          if (method === "publicKey") {
            reg.active.postMessage(
              {
                cmd: "asymmetricEncryptFirstChunk",
                chunk,
                last: index >= file.size,
              },
              [chunk]
            );
          }
        });
    });
  };

  const continueEncryption = (e) => {
    navigator.serviceWorker.ready.then((reg) => {
      file
        .slice(index, index + CHUNK_SIZE)
        .arrayBuffer()
        .then((chunk) => {
          index += CHUNK_SIZE;
          e.source.postMessage(
            { cmd: "encryptRestOfChunks", chunk, last: index >= file.size },
            [chunk]
          );
        });
    });
  };

  const createShareableLink = async () => {
    let pk = await computePublicKey(PrivateKey);
    let link = window.location.origin + "/?tab=decryption&publicKey=" + pk;
    setShareableLink(link);
  };

  useEffect(() => {
    const pingSW = setInterval(() => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active.postMessage({
          cmd: "pingSW",
        });
      });
    }, 15000);
    return () => clearInterval(pingSW);
  }, []);

  useEffect(() => {
    if (query.tab === "encryption" && query.publicKey) {
      setPublicKey(query.publicKey);
      setPkAlert(true);
      setEncryptionMethod("publicKey");
    }
  }, [query.publicKey, query.tab]);

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (e) => {
      switch (e.data.reply) {
        case "goodKeyPair":
          setActiveStep(2);
          break;

        case "wrongPrivateKey":
          setWrongPrivateKey(true);
          break;

        case "wrongPublicKey":
          setWrongPublicKey(true);
          break;

        case "wrongKeyPair":
          setKeysError(true);
          setKeysErrorMessage(
            t('invalid_key_pair')
          );
          break;

        case "wrongKeyInput":
          setKeysError(true);
          setKeysErrorMessage(t('invalid_keys_input'));
          break;

        case "keysGenerated":
          startEncryption("secretKey");
          break;

        case "keyPairReady":
          startEncryption("publicKey");
          break;

        case "continueEncryption":
          continueEncryption(e);
          break;

        case "encryptionFinished":
          setIsDownloading(false);
          handleNext();
          break;
      }
    });
  }, []);

  return (
    <div className={classes.root} {...getRootProps()}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={showSnackBar}
      >
        <Alert onClose={showSnackBar} severity="success">
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Backdrop open={isDragActive} style={{ zIndex: 1 }}>
        <Typography
          variant="h2"
          gutterBottom
          style={{ color: "#fff", textAlign: "center" }}
        >
          <img
            src="/assets/images/logo2.png"
            width="100"
            height="100"
            alt="hat.sh logo"
          />
          <br />
          {t('drop_file_enc')}
        </Typography>
      </Backdrop>

      <Collapse in={pkAlert} style={{ marginTop: 5 }}>
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setPkAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {t('recipient_key_loaded')}
        </Alert>
      </Collapse>

      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        className={classes.stepper}
      >
        <Step key={1}>
          <StepLabel
            StepIconProps={{
              classes: {
                root: classes.stepIcon,
                active: classes.activeStepIcon,
                completed: classes.completedStepIcon,
              },
            }}
          >
            {t('choose_file_enc')}
          </StepLabel>
          <StepContent>
            <div className="wrapper p-3" id="encFileWrapper">
              <div className={classes.fileArea} id="encFileArea">
                <Typography>
                  {File ? File.name : t('drag_drop')}
                </Typography>
                <Typography>{File ? formatBytes(File.size) : ""}</Typography>

                <input
                  {...getInputProps()}
                  className={classes.input}
                  id="enc-file"
                  type="file"
                  onChange={(e) => handleFileInput(e.target.files[0])}
                />
                <label htmlFor="enc-file">
                  <br />
                  <Button
                    className={classes.browseButton}
                    component="span"
                    startIcon={<DescriptionIcon />}
                  >
                    {File ? t('change_file') : t('browse_file')}
                  </Button>
                </label>
              </div>
            </div>

            <div className={classes.actionsContainer}>
              <div>
                <Button
                  fullWidth
                  disabled={!File}
                  variant="contained"
                  onClick={handleNext}
                  className={`${classes.nextButton} submitFile`}
                >
                  {t('next')}
                </Button>
              </div>
            </div>
          </StepContent>
        </Step>

        <Step key={2}>
          <StepLabel
            StepIconProps={{
              classes: {
                root: classes.stepIcon,
                active: classes.activeStepIcon,
                completed: classes.completedStepIcon,
              },
            }}
          >
            {encryptionMethod === "secretKey"
              ? t('enter_password_enc')
              : t('enter_keys_enc')}
          </StepLabel>

          <StepContent>
            <FormControl
              component="fieldset"
              style={{ float: "right", marginBottom: "15px" }}
            >
              <RadioGroup
                row
                defaultValue={encryptionMethod}
                aria-label="encryption options"
              >
                <FormControlLabel
                  value="secretKey"
                  control={<Radio color="default" />}
                  label={t('password')}
                  labelPlacement="end"
                  onChange={handleRadioChange}
                />
                <FormControlLabel
                  value="publicKey"
                  className="publicKeyInput"
                  control={<Radio color="default" />}
                  label={t('public_key')}
                  labelPlacement="end"
                  onChange={handleRadioChange}
                />
              </RadioGroup>
            </FormControl>

            {encryptionMethod === "secretKey" && (
              <TextField
                required
                type={showPassword ? "text" : "password"}
                id="encPasswordInput"
                label={t('required')}
                placeholder={t('password')}
                helperText={
                  Password
                    ? t('password_strength') + " : " + passwordStrengthCheck(Password)
                    : t('choose_strong_password')
                }
                variant="outlined"
                value={Password ? Password : ""}
                onChange={(e) => handlePasswordInput(e.target.value)}
                fullWidth
                InputLabelProps={{
                  classes: {
                    root: classes.textFieldLabel,
                    focused: classes.textFieldLabelFocused,
                  },
                }}
                InputProps={{
                  classes: {
                    root: classes.textFieldRoot,
                    focused: classes.textFieldFocused,
                    notchedOutline: classes.textFieldNotchedOutline,
                  },

                  endAdornment: (
                    <>
                      {Password && (
                        <Tooltip title={t('show_password')} placement="left">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('generate_password')} placement="left">
                        <IconButton
                          onClick={generatedPassword}
                          className="generatePasswordBtn"
                        >
                          <CachedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ),
                }}
              />
            )}

            {encryptionMethod === "publicKey" && (
              <>
                <TextField
                  id="public-key-input"
                  required
                  error={wrongPublicKey ? true : false}
                  label={wrongPublicKey ? t('error') : t('recipient_public_key')}
                  helperText={wrongPublicKey ? t('wrong_public_key') : ""}
                  placeholder={t('enter_recipient_public_key')}
                  variant="outlined"
                  value={PublicKey ? PublicKey : ""}
                  onChange={(e) => handlePublicKeyInput(e.target.value)}
                  fullWidth
                  style={{ marginBottom: "15px" }}
                  InputLabelProps={{
                    classes: {
                      root: classes.textFieldLabel,
                      focused: classes.textFieldLabelFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.textFieldRoot,
                      focused: classes.textFieldFocused,
                      notchedOutline: classes.textFieldNotchedOutline,
                    },

                    endAdornment: (
                      <>
                        <input
                          accept=".public"
                          className={classes.input}
                          id="public-key-file"
                          type="file"
                          onChange={(e) => loadPublicKey(e.target.files[0])}
                        />
                        <label htmlFor="public-key-file">
                          <Tooltip title={t('load_public_key')} placement="left">
                            <IconButton
                              aria-label={t('load_public_key')}
                              component="span"
                            >
                              <AttachFileIcon />
                            </IconButton>
                          </Tooltip>
                        </label>
                      </>
                    ),
                  }}
                />

                <TextField
                  id="private-key-input"
                  type={showPrivateKey ? "text" : "password"}
                  required
                  error={wrongPrivateKey ? true : false}
                  label={wrongPrivateKey ? t('error') : t('your_private_key_enc')}
                  helperText={wrongPrivateKey ? t('wrong_private_key') : ""}
                  placeholder={t('enter_private_key_enc')}
                  variant="outlined"
                  value={PrivateKey ? PrivateKey : ""}
                  onChange={(e) => handlePrivateKeyInput(e.target.value)}
                  fullWidth
                  style={{ marginBottom: "15px" }}
                  InputLabelProps={{
                    classes: {
                      root: classes.textFieldLabel,
                      focused: classes.textFieldLabelFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.textFieldRoot,
                      focused: classes.textFieldFocused,
                      notchedOutline: classes.textFieldNotchedOutline,
                    },

                    endAdornment: (
                      <>
                        {PrivateKey && (
                          <Tooltip title={t('show_private_key')} placement="left">
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
                        )}

                        <input
                          accept=".private"
                          className={classes.input}
                          id="private-key-file"
                          type="file"
                          onChange={(e) => loadPrivateKey(e.target.files[0])}
                        />
                        <label htmlFor="private-key-file">
                          <Tooltip title={t('load_private_key')} placement="left">
                            <IconButton
                              aria-label={t('load_private_key')}
                              component="span"
                            >
                              <AttachFileIcon />
                            </IconButton>
                          </Tooltip>
                        </label>
                      </>
                    ),
                  }}
                />

                <KeyPairGeneration />
              </>
            )}

            <div className={classes.actionsContainer} style={{ marginTop: 15 }}>
              <div>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                      fullWidth
                    >
                      {t('back')}
                    </Button>
                  </Grid>
                  <Grid item xs>
                    <Button
                      disabled={
                        (encryptionMethod === "secretKey" && !Password) ||
                        (encryptionMethod === "publicKey" &&
                          (!PublicKey || !PrivateKey))
                      }
                      variant="contained"
                      onClick={handleMethodStep}
                      className={`${classes.nextButton} submitKeys`}
                      fullWidth
                    >
                      {t('next')}
                    </Button>
                  </Grid>
                </Grid>
                <br />

                {encryptionMethod === "publicKey" && keysError && (
                  <Alert severity="error">{keysErrorMessage}</Alert>
                )}
              </div>
            </div>
          </StepContent>
        </Step>

        <Step key={3}>
          <StepLabel
            StepIconProps={{
              classes: {
                root: classes.stepIcon,
                active: classes.activeStepIcon,
                completed: classes.completedStepIcon,
              },
            }}
          >
            {t('download_encrypted_file')}
          </StepLabel>
          <StepContent>
            <Alert severity="success" icon={<LockOutlinedIcon />}>
              <strong>{File ? File.name : ""}</strong> {t('ready_to_download')}
            </Alert>

            <div className={classes.actionsContainer}>
              <Grid container spacing={1}>
                <Grid item>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    {t('back')}
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    disabled={
                      isDownloading ||
                      (!Password && !PublicKey && !PrivateKey) ||
                      !File
                    }
                    variant="contained"
                    className={classes.nextButton}
                    startIcon={
                      isDownloading ? (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      ) : (
                        <GetAppIcon />
                      )
                    }
                    fullWidth
                  >
                    <a
                      onClick={(e) => handleEncryptedFileDownload(e)}
                      className="downloadFile"
                      style={{
                        color: "#ffffff",
                        textDecoration: "none",
                      }}
                    >
                      {isDownloading ? t('downloading_file') : t('encrypted_file')}
                    </a>
                  </Button>
                </Grid>
              </Grid>
              <br />

              {isDownloading && (
                <Alert variant="outlined" severity="info">
                  {t('page_close_alert')}
                </Alert>
              )}
            </div>
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 3 && (
        <Paper elevation={0} className={classes.resetContainer}>
          <Alert
            variant="outlined"
            severity="success"
            style={{ border: "none" }}
          >
            <AlertTitle>{t('success')}</AlertTitle>
            {t('success_downloaded_file_enc')}
            {encryptionMethod === "publicKey" && (
              <>
                <br />
                <br />
                <ul>
                  <li>
                    {t('after_enc_note_one')}
                  </li>
                  <li>
                    {t('after_enc_note_two')}
                  </li>
                </ul>
              </>
            )}
          </Alert>

          <Grid container spacing={1}>
            {encryptionMethod === "secretKey" && (
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(Password);
                    setSnackBarMessage(t('password_copied'));
                    showSnackBar();
                  }}
                  className={`${classes.button} copyPassword`}
                  variant="outlined"
                  startIcon={<FileCopyIcon />}
                  fullWidth
                  style={{ textTransform: "none" }}
                >
                  {t('copy_password')}
                </Button>
              </Grid>
            )}

            {encryptionMethod === "publicKey" && (
              <Grid item xs={12} sm={6}>
                <Tooltip
                  title={t('create_shareable_link_tooltip')}
                  placement="bottom"
                >
                  <Button
                    onClick={() => createShareableLink()}
                    className={classes.button}
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    fullWidth
                    style={{ textTransform: "none" }}
                  >
                    {t('create_shareable_link')}
                  </Button>
                </Tooltip>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Button
                onClick={handleReset}
                className={classes.button}
                variant="outlined"
                startIcon={<RefreshIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                {t('encrypt_another_file')}
              </Button>
            </Grid>

            {encryptionMethod === "publicKey" && shareableLink && (
              <TextField
                style={{ marginTop: 15 }}
                defaultValue={
                  shareableLink != undefined ? shareableLink : shareableLink
                }
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
                            navigator.clipboard.writeText(shareableLink);
                            setSnackBarMessage(t('create_shareable_link_copied'));
                            showSnackBar();
                          }}
                        >
                          <FileCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ),
                }}
                helperText={t('create_shareable_link_note')}
                variant="outlined"
                fullWidth
              />
            )}
          </Grid>
        </Paper>
      )}
    </div>
  );
}
