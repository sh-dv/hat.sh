/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { formatBytes } from "../helpers/formatBytes";
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
import AddIcon from "@material-ui/icons/Add";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { getTranslations as t } from "../../locales";
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  offline: {
    fontSize: 12,
    float: "right",
    color: theme.palette.diamondBlack.main,
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

  resetButton: {
    marginLeft: 8,
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    textTransform: "none",
    borderRadius: "8px",
    border: "none",
    color: theme.palette.flower.text,
    backgroundColor: theme.palette.flower.main,
    "&:hover": {
      backgroundColor: theme.palette.flower.light,
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

  fileArea: {
    padding: "20px",
    border: "5px dashed",
    borderColor: theme.palette.gallery.main,
    borderRadius: "14px",
    marginBottom: "10px",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  filesInfo: {
    float: "right",
    marginTop: 15,
    textTransform: "none",
    color: theme.palette.cottonBoll.text,
    transition: "background-color 0.2s ease-out",
    transition: "color .01s",
  },

  filesPaper: {
    marginBottom: 15,
    overflow: "auto",
    maxHeight: "280px",
    backgroundColor: "transparent",
  },

  filesList: {
    display: "flex",
    flex: "1",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
  },

  filesListItem: {
    backgroundColor: "#f3f3f3",
    borderRadius: "8px",
    padding: 15,
  },

  filesListItemText: {
    width: "100px",
    maxWidth: "150px",
    minHeight: "50px",
    maxHeight: "50px",
  },
}));

let file,
  files = [],
  password,
  index,
  currFile = 0,
  numberOfFiles,
  encryptionMethodState = "secretKey",
  privateKey,
  publicKey;

export default function EncryptionPanel() {
  const classes = useStyles();

  const router = useRouter();

  const query = router.query;

  const [activeStep, setActiveStep] = useState(0);

  const [Files, setFiles] = useState([]);

  const [currFileState, setCurrFileState] = useState(0);

  const [sumFilesSizes, setSumFilesSizes] = useState(0);

  const [Password, setPassword] = useState();

  const [showPassword, setShowPassword] = useState(false);

  const [PublicKey, setPublicKey] = useState();

  const [PrivateKey, setPrivateKey] = useState();

  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const [wrongPublicKey, setWrongPublicKey] = useState(false);

  const [wrongPrivateKey, setWrongPrivateKey] = useState(false);

  const [keysError, setKeysError] = useState(false);

  const [keysErrorMessage, setKeysErrorMessage] = useState();

  const [shortPasswordError, setShortPasswordError] = useState(false);

  const [encryptionMethod, setEncryptionMethod] = useState("secretKey");

  const [isDownloading, setIsDownloading] = useState(false);

  const [shareableLink, setShareableLink] = useState();

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState();

  const [pkAlert, setPkAlert] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFilesInput(acceptedFiles);
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
    setShortPasswordError(false);
  };

  const handleRadioChange = (method) => {
    setEncryptionMethod(method);
    encryptionMethodState = method;
  };

  const handleReset = () => {
    setActiveStep(0);
    setFiles([]);
    setPassword();
    setPublicKey();
    setPrivateKey();
    privateKey = null;
    publicKey = null;
    setWrongPublicKey(false);
    setWrongPrivateKey(false);
    setKeysError(false);
    setShortPasswordError(false);
    setIsDownloading(false);
    setShareableLink();
    setSnackBarMessage();
    setPkAlert(false);
    setSumFilesSizes(0);
    file = null;
    files = [];
    numberOfFiles = 0;
    resetCurrFile();
    index = null;
    router.replace(router.pathname);
  };

  const showSnackBar = () => {
    setSnackBarOpen(!snackBarOpen);
  };

  const resetCurrFile = () => {
    currFile = 0;
    setCurrFileState(currFile);
  };

  const updateCurrFile = () => {
    currFile += 1;
    setCurrFileState(currFile);
  };

  const handleMethodStep = () => {
    if (encryptionMethodState === "secretKey") {
      if (Password.length >= 12) {
        setActiveStep(2);
      } else {
        setShortPasswordError(true);
      }
    }

    if (encryptionMethodState === "publicKey") {
      navigator.serviceWorker.ready.then((reg) => {
        let mode = "test";

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
    password = generated;
    setPassword(generated);
    setShortPasswordError(false);
  };

  const handleFilesInput = (selectedFiles) => {
    selectedFiles = Array.from(selectedFiles);
    if (files.length > 0) {
      files = files.concat(selectedFiles);
      files = files.filter(
        (thing, index, self) =>
          index ===
          self.findIndex((t) => t.name === thing.name && t.size === thing.size)
      );
    } else {
      files = selectedFiles;
    }
    setFiles(files);
    updateTotalFilesSize();
  };

  const updateFilesInput = (index) => {
    files = [...files.slice(0, index), ...files.slice(index + 1)];
    setFiles(files);
    updateTotalFilesSize();
  };

  const resetFilesInput = () => {
    files = [];
    setFiles(files);
    setSumFilesSizes(0);
  };

  const updateTotalFilesSize = () => {
    if (files) {
      let sum = files.reduce(function (prev, current) {
        return prev + current.size;
      }, 0);

      setSumFilesSizes(sum);
    }
  };

  const handlePasswordInput = (selectedPassword) => {
    password = selectedPassword;
    setPassword(selectedPassword);
  };

  const handlePublicKeyInput = (selectedKey) => {
    setPublicKey(selectedKey);
    publicKey = selectedKey;
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
          publicKey = reader.result;
        };
        setWrongPublicKey(false);
      }
    }
  };

  const handlePrivateKeyInput = (selectedKey) => {
    setPrivateKey(selectedKey);
    privateKey = selectedKey;
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
          privateKey = reader.result;
        };
        setWrongPrivateKey(false);
      }
    }
  };

  const handleEncryptedFilesDownload = async (e) => {
    numberOfFiles = Files.length;
    prepareFile();
  };

  const prepareFile = () => {
    // send file name to sw
    let fileName = encodeURIComponent(files[currFile].name + ".enc");
    navigator.serviceWorker.ready.then((reg) => {
      reg.active.postMessage({ cmd: "prepareFileNameEnc", fileName });
    });
  };

  const kickOffEncryption = async () => {
    if (currFile <= numberOfFiles - 1) {
      file = files[currFile];
      window.open(`file`, "_self");
      setIsDownloading(true);

      if (encryptionMethodState === "publicKey") {
        navigator.serviceWorker.ready.then((reg) => {
          let mode = "derive";

          reg.active.postMessage({
            cmd: "requestEncKeyPair",
            privateKey,
            publicKey,
            mode,
          });
        });
      }

      if (encryptionMethodState === "secretKey") {
        navigator.serviceWorker.ready.then((reg) => {
          reg.active.postMessage({ cmd: "requestEncryption", password });
        });
      }
    } else {
      // console.log("out of files")
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
      publicKey = query.publicKey;
      setPkAlert(true);
      setEncryptionMethod("publicKey");
      encryptionMethodState = "publicKey";
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
          setKeysErrorMessage(t("invalid_key_pair"));
          break;

        case "wrongKeyInput":
          setKeysError(true);
          setKeysErrorMessage(t("invalid_keys_input"));
          break;

        case "keysGenerated":
          startEncryption("secretKey");
          break;

        case "keyPairReady":
          startEncryption("publicKey");
          break;

        case "filePreparedEnc":
          kickOffEncryption();
          break;

        case "continueEncryption":
          continueEncryption(e);
          break;

        case "encryptionFinished":
          if (numberOfFiles > 1) {
            updateCurrFile();
            file = null;
            index = null;
            if (currFile <= numberOfFiles - 1) {
              setTimeout(function () {
                prepareFile();
              }, 1000);
            } else {
              setIsDownloading(false);
              handleNext();
            }
          } else {
            setIsDownloading(false);
            handleNext();
          }
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
        <Alert severity="success">
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Backdrop open={isDragActive} style={{ zIndex: 10 }}>
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
          {t("drop_file_enc")}
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
          {t("recipient_key_loaded")}
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
            {t("choose_files_enc")}
          </StepLabel>
          <StepContent>
            <div className="wrapper p-3" id="encFileWrapper">
              <div
                className={classes.fileArea}
                id="encFileArea"
                style={{ display: Files.length > 0 ? "" : "flex" }}
              >
                <Paper elevation={0} className={classes.filesPaper}>
                  <List dense={true} className={classes.filesList}>
                    {Files.length > 0
                      ? Files.map((file, index) => (
                          <ListItem
                            key={index}
                            className={classes.filesListItem}
                          >
                            <ListItemText
                              className={classes.filesListItemText}
                              primary={file.name}
                              secondary={formatBytes(file.size)}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                style={{ marginTop: 40 }}
                                onClick={() => updateFilesInput(index)}
                                edge="end"
                                aria-label="delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      : t("drag_drop_files")}
                  </List>
                </Paper>

                <input
                  {...getInputProps()}
                  className={classes.input}
                  id="enc-file"
                  type="file"
                  onChange={(e) => handleFilesInput(e.target.files)}
                  multiple
                />
                <label htmlFor="enc-file">
                  <Button
                    className={classes.browseButton}
                    component="span"
                    startIcon={
                      Files.length > 0 ? <AddIcon /> : <DescriptionIcon />
                    }
                  >
                    {Files.length > 0 ? t("add_files") : t("browse_files")}
                  </Button>
                </label>

                {Files.length > 0 && (
                  <>
                    <Button
                      onClick={() => resetFilesInput()}
                      className={classes.resetButton}
                      component="span"
                      startIcon={<RotateLeftIcon />}
                    >
                      {t("reset")}
                    </Button>

                    <small className={classes.filesInfo}>
                      {Files.length} {Files.length > 1 ? t("files") : t("file")}
                      {Files.length > 1 && <>, {formatBytes(sumFilesSizes)}</>}
                    </small>
                  </>
                )}
              </div>
            </div>

            <div className={classes.actionsContainer}>
              <div>
                <Button
                  fullWidth
                  disabled={Files.length === 0}
                  variant="contained"
                  onClick={handleNext}
                  className={`${classes.nextButton} nextBtnHs submitFile`}
                >
                  {t("next")}
                </Button>
              </div>
            </div>

            <Typography className={classes.offline}>
              {t("offline_note")}
            </Typography>
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
              ? t("enter_password_enc")
              : t("enter_keys_enc")}
          </StepLabel>

          <StepContent>
            <FormControl
              component="fieldset"
              style={{ float: "right", marginBottom: "15px" }}
            >
              <RadioGroup
                row
                value={encryptionMethod}
                aria-label="encryption options"
              >
                <FormControlLabel
                  value="secretKey"
                  control={<Radio color="default" />}
                  label={t("password")}
                  labelPlacement="end"
                  onChange={() => handleRadioChange("secretKey")}
                />
                <FormControlLabel
                  value="publicKey"
                  className="publicKeyInput"
                  control={<Radio color="default" />}
                  label={t("public_key")}
                  labelPlacement="end"
                  onChange={() => handleRadioChange("publicKey")}
                />
              </RadioGroup>
            </FormControl>

            {encryptionMethod === "secretKey" && (
              <TextField
                required
                error={shortPasswordError ? true : false}
                type={showPassword ? "text" : "password"}
                id="encPasswordInput"
                label={t("required")}
                placeholder={t("password")}
                helperText={
                  Password ? (
                    <Tooltip
                      title={`${t("crackTimeEstimation")} ${
                        passwordStrengthCheck(Password)[1]
                      }`}
                      placement="right"
                      arrow
                    >
                      <span>
                        {t("password_strength")}
                        {": "}
                        <strong>{passwordStrengthCheck(Password)[0]}</strong>
                      </span>
                    </Tooltip>
                  ) : (
                    t("choose_strong_password")
                  )
                }
                variant="outlined"
                value={Password ? Password : ""}
                onChange={(e) => handlePasswordInput(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <>
                      {Password && (
                        <Tooltip title={t("show_password")} placement="left">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t("generate_password")} placement="left">
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
                  label={
                    wrongPublicKey ? t("error") : t("recipient_public_key")
                  }
                  helperText={wrongPublicKey ? t("wrong_public_key") : ""}
                  placeholder={t("enter_recipient_public_key")}
                  variant="outlined"
                  value={PublicKey ? PublicKey : ""}
                  onChange={(e) => handlePublicKeyInput(e.target.value)}
                  fullWidth
                  style={{ marginBottom: "15px" }}
                  InputProps={{
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
                          <Tooltip
                            title={t("load_public_key")}
                            placement="left"
                          >
                            <IconButton
                              aria-label={t("load_public_key")}
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
                  label={
                    wrongPrivateKey ? t("error") : t("your_private_key_enc")
                  }
                  helperText={wrongPrivateKey ? t("wrong_private_key") : ""}
                  placeholder={t("enter_private_key_enc")}
                  variant="outlined"
                  value={PrivateKey ? PrivateKey : ""}
                  onChange={(e) => handlePrivateKeyInput(e.target.value)}
                  fullWidth
                  style={{ marginBottom: "15px" }}
                  InputProps={{
                    endAdornment: (
                      <>
                        {PrivateKey && (
                          <Tooltip
                            title={t("show_private_key")}
                            placement="left"
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
                        )}

                        <input
                          accept=".private"
                          className={classes.input}
                          id="private-key-file"
                          type="file"
                          onChange={(e) => loadPrivateKey(e.target.files[0])}
                        />
                        <label htmlFor="private-key-file">
                          <Tooltip
                            title={t("load_private_key")}
                            placement="left"
                          >
                            <IconButton
                              aria-label={t("load_private_key")}
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
                      {t("back")}
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
                      className={`${classes.nextButton} nextBtnHs submitKeys`}
                      fullWidth
                    >
                      {t("next")}
                    </Button>
                  </Grid>
                </Grid>
                <br />

                {encryptionMethod === "publicKey" && keysError && (
                  <Alert severity="error">{keysErrorMessage}</Alert>
                )}

                {encryptionMethod === "secretKey" && shortPasswordError && (
                  <Alert severity="error">{t("short_password")}</Alert>
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
            {t("download_encrypted_files")}
          </StepLabel>
          <StepContent>
            {Files.length > 0 && (
              <Alert severity="success" icon={<LockOutlinedIcon />}>
                <strong>
                  {Files.length > 1 ? Files.length : Files[0].name}
                </strong>{" "}
                {Files.length > 1
                  ? t("files_ready_to_download")
                  : t("ready_to_download")}
              </Alert>
            )}

            <div className={classes.actionsContainer}>
              <Grid container spacing={1}>
                <Grid item>
                  <Button
                    disabled={activeStep === 0 || isDownloading}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    {t("back")}
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    disabled={
                      isDownloading ||
                      (!Password && !PublicKey && !PrivateKey) ||
                      Files.length === 0
                    }
                    variant="contained"
                    className={`${classes.nextButton} nextBtnHs`}
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
                      onClick={(e) => handleEncryptedFilesDownload(e)}
                      className="downloadFile"
                      style={{
                        width: "100%",
                        textDecoration: "none",
                      }}
                    >
                      {isDownloading
                        ? `${currFileState + 1}/${numberOfFiles} ${t(
                            "downloading_file"
                          )}`
                        : t("encrypted_files")}
                    </a>
                  </Button>
                </Grid>
              </Grid>
              <br />

              {isDownloading && (
                <Alert variant="outlined" severity="info">
                  {t("page_close_alert")}
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
            <AlertTitle>{t("success")}</AlertTitle>
            {t("success_downloaded_files_enc")}
            {encryptionMethod === "publicKey" && (
              <>
                <br />
                <br />
                <ul>
                  <li>{t("after_enc_note_one")}</li>
                  <li>{t("after_enc_note_two")}</li>
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
                    setSnackBarMessage(t("password_copied"));
                    showSnackBar();
                  }}
                  className={`${classes.button} copyPassword`}
                  variant="outlined"
                  startIcon={<FileCopyIcon />}
                  fullWidth
                  style={{ textTransform: "none" }}
                >
                  {t("copy_password")}
                </Button>
              </Grid>
            )}

            {encryptionMethod === "publicKey" && (
              <Grid item xs={12} sm={6}>
                <Tooltip
                  title={t("create_shareable_link_tooltip")}
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
                    {t("create_shareable_link")}
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
                {t("encrypt_more_files")}
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
                      <Tooltip title={t("copy_link")} placement="left">
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(shareableLink);
                            setSnackBarMessage(
                              t("create_shareable_link_copied")
                            );
                            showSnackBar();
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
          </Grid>
        </Paper>
      )}
    </div>
  );
}
