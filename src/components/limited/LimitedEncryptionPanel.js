/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import KeyPairGeneration from "../KeyPairGeneration";
import passwordStrengthCheck from "../../utils/passwordStrengthCheck";
import {
  MAX_FILE_SIZE,
  SIGNATURES,
  CHUNK_SIZE,
  encoder,
} from "../../config/Constants";
import { formatBytes } from "../../helpers/formatBytes";
import { computePublicKey } from "../../utils/computePublicKey";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Tooltip from "@material-ui/core/Tooltip";
import Backdrop from "@material-ui/core/Backdrop";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RefreshIcon from "@material-ui/icons/Refresh";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import DescriptionIcon from "@material-ui/icons/Description";
import GetAppIcon from "@material-ui/icons/GetApp";
import CachedIcon from "@material-ui/icons/Cached";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import LinkIcon from "@material-ui/icons/Link";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

import { getTranslations as t } from "../../../locales";

const _sodium = require("libsodium-wrappers");

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

let file,
  limitedIndex,
  limitedSalt,
  limitedKey,
  limitedState,
  limitedHeader,
  limitedEncFileBuff,
  encRx,
  encTx;

const LimitedEncryptionPanel = () => {
  const classes = useStyles();

  const router = useRouter();

  const query = router.query;

  const [activeStep, setActiveStep] = useState(0);

  const [File, setFile] = useState();

  const [largeFile, setLargeFile] = useState(false);

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

  const [isEncrypting, setIsEncrypting] = useState(false);

  const [shareableLink, setShareableLink] = useState();

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState();

  const [pkAlert, setPkAlert] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFile) => {
      handleLimitedFileInput(acceptedFile[0]);
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

  const handleRadioChange = (e) => {
    setEncryptionMethod(e.target.value);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile();
    setPassword();
    setIsEncrypting(false);
    setPublicKey();
    setPrivateKey();
    setWrongPublicKey(false);
    setWrongPrivateKey(false);
    setKeysError(false);
    setShortPasswordError(false);
    setShareableLink();
    setSnackBarMessage();
    setPkAlert(false);
    file = null;
    limitedEncFileBuff = null;
    limitedIndex = null;
    (encRx = null), (encTx = null);
    router.replace(router.pathname);
  };

  const showSnackBar = () => {
    setSnackBarOpen(!snackBarOpen);
  };

  const handleMethodStep = () => {
    if (encryptionMethod === "secretKey") {
      if (Password.length >= 12) {
        setActiveStep(2);
      } else {
        setShortPasswordError(true);
      }
    }

    if (encryptionMethod === "publicKey") {
      let mode = "test";
      let privateKey = PrivateKey;
      let publicKey = PublicKey;
      encKeyPair(privateKey, publicKey, mode);
    }
  };

  const generatedPassword = async () => {
    await _sodium.ready;
    const sodium = _sodium;
    let gPassword = sodium.to_base64(
      sodium.randombytes_buf(16),
      sodium.base64_variants.URLSAFE_NO_PADDING
    );
    setPassword(gPassword);
    setShortPasswordError(false);
  };

  const handleLimitedFileInput = (selectedFile) => {
    file = selectedFile;

    if (file.size > MAX_FILE_SIZE) {
      setLargeFile(true);
      setFile();
    } else {
      setFile(selectedFile);
      setLargeFile(false);
    }
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

  const encKeyPair = async (csk, spk, mode) => {
    await _sodium.ready;
    const sodium = _sodium;

    try {
      let computed = sodium.crypto_scalarmult_base(sodium.from_base64(csk));
      computed = sodium.to_base64(computed);
      if (csk === spk || spk === computed) {
        //wrong keypair
        setKeysError(true);
        setKeysErrorMessage(t("invalid_key_pair"));
        return;
      }

      if (sodium.from_base64(csk).length !== sodium.crypto_kx_SECRETKEYBYTES) {
        //wrong private key
        setWrongPrivateKey(true);
        return;
      }

      if (sodium.from_base64(spk).length !== sodium.crypto_kx_PUBLICKEYBYTES) {
        //wrongPublicKey
        setWrongPublicKey(true);
        return;
      }

      let key = sodium.crypto_kx_client_session_keys(
        sodium.crypto_scalarmult_base(sodium.from_base64(csk)),
        sodium.from_base64(csk),
        sodium.from_base64(spk)
      );

      if (key) {
        [encRx, encTx] = [key.sharedRx, key.sharedTx];

        if (mode === "test" && encRx && encTx) {
          //good keypair
          setActiveStep(2);
        }

        if (mode === "derive" && encRx && encTx) {
          let limitedRes =
            sodium.crypto_secretstream_xchacha20poly1305_init_push(encTx);
          limitedState = limitedRes.state;
          limitedHeader = limitedRes.header;
          //keyPairReady
        }
      } else {
        //wrong keypair
        setKeysError(true);
        setKeysErrorMessage(t("invalid_key_pair"));
        return;
      }
    } catch (error) {
      setKeysError(true);
      setKeysErrorMessage(t("invalid_keys_input"));
      return;
    }
  };

  const handleEncryptionRequest = async () => {
    if (encryptionMethod === "secretKey") {
      await limitedEncKeyGenerator(Password);
      startLimitedEncryption(File);
    }

    if (encryptionMethod === "publicKey") {
      let mode = "derive";
      let privateKey = PrivateKey;
      let publicKey = PublicKey;
      await encKeyPair(privateKey, publicKey, mode);
      startLimitedEncryption(File);
    }
  };

  const limitedEncKeyGenerator = async (password) => {
    await _sodium.ready;
    const sodium = _sodium;

    limitedSalt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

    limitedKey = sodium.crypto_pwhash(
      sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
      password,
      limitedSalt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    let limitedRes =
      sodium.crypto_secretstream_xchacha20poly1305_init_push(limitedKey);
    limitedState = limitedRes.state;
    limitedHeader = limitedRes.header;
  };

  const startLimitedEncryption = (file) => {
    if (encryptionMethod === "secretKey") {
      const SIGNATURE = new Uint8Array(
        encoder.encode(SIGNATURES["v2_symmetric"])
      );

      setIsEncrypting(true);
      limitedEncFileBuff = []; //clear array
      limitedEncFileBuff.push(SIGNATURE);
      limitedEncFileBuff.push(limitedSalt);
      limitedEncFileBuff.push(limitedHeader);

      file
        .slice(0, CHUNK_SIZE)
        .arrayBuffer()
        .then((chunk) => {
          limitedIndex = CHUNK_SIZE;
          let limitedLast = limitedIndex >= file.size;
          limitedChunkEncryption(limitedLast, chunk, file);
        });
    }

    if (encryptionMethod === "publicKey") {
      const SIGNATURE = new Uint8Array(
        encoder.encode(SIGNATURES["v2_asymmetric"])
      );

      setIsEncrypting(true);
      limitedEncFileBuff = []; //clear array
      limitedEncFileBuff.push(SIGNATURE);
      limitedEncFileBuff.push(limitedHeader);

      file
        .slice(0, CHUNK_SIZE)
        .arrayBuffer()
        .then((chunk) => {
          limitedIndex = CHUNK_SIZE;
          let limitedLast = limitedIndex >= file.size;
          limitedChunkEncryption(limitedLast, chunk, file);
        });
    }
  };

  const limitedChunkEncryption = async (limitedLast, chunk, file) => {
    await _sodium.ready;
    const sodium = _sodium;

    let limitedTag = limitedLast
      ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
      : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

    const limitedEncryptedChunk =
      sodium.crypto_secretstream_xchacha20poly1305_push(
        limitedState,
        new Uint8Array(chunk),
        null,
        limitedTag
      );

    limitedEncFileBuff.push(new Uint8Array(limitedEncryptedChunk));

    if (limitedLast) {
      handleFinishedEncryption();
    }

    if (!limitedLast) {
      continueLimitedEncryption(file);
    }
  };

  const continueLimitedEncryption = (file) => {
    file
      .slice(limitedIndex, limitedIndex + CHUNK_SIZE)
      .arrayBuffer()
      .then((chunk) => {
        limitedIndex += CHUNK_SIZE;
        let limitedLast = limitedIndex >= file.size;

        limitedChunkEncryption(limitedLast, chunk, file);
      });
  };

  const handleFinishedEncryption = () => {
    setIsEncrypting(false);
    handleNext();
  };

  const handleEncryptedFileDownload = () => {
    let fileName = File.name + ".enc";
    let blob = new Blob(limitedEncFileBuff);
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  };

  const createShareableLink = async () => {
    let pk = await computePublicKey(PrivateKey);
    let link = window.location.origin + "/?tab=decryption&publicKey=" + pk;
    setShareableLink(link);
  };

  useEffect(() => {
    if (query.tab === "encryption" && query.publicKey) {
      setPublicKey(query.publicKey);
      setPkAlert(true);
      setEncryptionMethod("publicKey");
    }
  }, [query.publicKey, query.tab]);

  return (
    <div className={classes.root} {...getRootProps()}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
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
            {t("choose_file_enc")}
          </StepLabel>
          <StepContent>
            <div className="wrapper p-3" id="encFileWrapper">
              <div className={classes.fileArea} id="encFileArea">
                <Paper
                  elevation={0}
                  style={{
                    overflow: "auto",
                    maxHeight: "280px",
                    backgroundColor: "transparent",
                  }}
                >
                  <List
                    dense={true}
                    style={{
                      display: "flex",
                      flex: "1",
                      flexWrap: "wrap",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    {File ? (
                      <ListItem
                        style={{
                          backgroundColor: "#ebebeb",
                          borderRadius: "8px",
                          padding: 15,
                        }}
                      >
                        <ListItemText
                          style={{
                            width: "200px",
                            minHeight: "50px",
                            maxHeight: "50px",
                            textAlign: "center",
                          }}
                          primary={File.name}
                          secondary={formatBytes(File.size)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            style={{ marginTop: 40 }}
                            onClick={() => setFile()}
                            edge="end"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ) : (
                      t("drag_drop")
                    )}
                  </List>
                </Paper>

                <input
                  {...getInputProps()}
                  className={classes.input}
                  id="enc-file"
                  type="file"
                  onChange={(e) => handleLimitedFileInput(e.target.files[0])}
                />
                <label htmlFor="enc-file">
                  <br />
                  <Button
                    className={classes.browseButton}
                    component="span"
                    startIcon={<DescriptionIcon />}
                  >
                    {File ? t("change_file") : t("browse_file")}
                  </Button>
                </label>
              </div>
            </div>

            <div className={classes.actionsContainer}>
              <Button
                fullWidth
                disabled={!File || largeFile}
                variant="contained"
                onClick={handleNext}
                className={`${classes.nextButton} nextBtnHs`}
              >
                {t("next")}
              </Button>

              {largeFile && (
                <>
                  <Alert severity="error" style={{ marginTop: 15 }}>
                    <strong>{t("file_too_big")}</strong> {t("choose_file_1gb")}
                  </Alert>
                </>
              )}
            </div>
            {!largeFile && (
              <Typography className={classes.offline}>
                {t("offline_note")}
              </Typography>
            )}
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
                defaultValue={encryptionMethod}
                aria-label="encryption options"
              >
                <FormControlLabel
                  value="secretKey"
                  control={<Radio color="default" />}
                  label={t("password")}
                  labelPlacement="end"
                  onChange={handleRadioChange}
                />
                <FormControlLabel
                  value="publicKey"
                  control={<Radio color="default" />}
                  label={t("public_key")}
                  labelPlacement="end"
                  onChange={handleRadioChange}
                />
              </RadioGroup>
            </FormControl>

            {encryptionMethod === "secretKey" && (
              <TextField
                required
                error={shortPasswordError ? true : false}
                type={showPassword ? "text" : "password"}
                id="outlined-required"
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
                      className={`${classes.nextButton} nextBtnHs`}
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
            {t("encrypt_file")}
          </StepLabel>
          <StepContent>
            <Alert severity="success" icon={<LockOutlinedIcon />}>
              <strong>{File ? File.name : ""}</strong> {t("ready_to_download")}
            </Alert>

            <div className={classes.actionsContainer}>
              <Grid container spacing={1}>
                <Grid item>
                  <Button
                    disabled={activeStep === 0 || isEncrypting}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    {t("back")}
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    onClick={handleEncryptionRequest}
                    disabled={
                      isEncrypting ||
                      (!Password && !PublicKey && !PrivateKey) ||
                      !File
                    }
                    variant="contained"
                    className={`${classes.nextButton} nextBtnHs`}
                    startIcon={
                      isEncrypting ? (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      ) : (
                        <LockOutlinedIcon />
                      )
                    }
                    fullWidth
                  >
                    {isEncrypting ? t("encrypting_file") : t("encrypt_file")}
                  </Button>
                </Grid>
              </Grid>
              <br />

              {isEncrypting && (
                <Alert variant="outlined" severity="info">
                  {t("page_close_alert_enc")}
                </Alert>
              )}
            </div>
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === 3 && (
        <Paper elevation={1} className={classes.resetContainer}>
          <Alert
            variant="outlined"
            severity="success"
            style={{ border: "none" }}
          >
            <AlertTitle>{t("success")}</AlertTitle>
            {t("success_encrypted")}
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
            <Grid item xs={12} sm={12}>
              <Button
                onClick={handleEncryptedFileDownload}
                className={`${classes.nextButton} nextBtnHs`}
                variant="contained"
                startIcon={<GetAppIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                {t("download_file")}
              </Button>
            </Grid>
            {encryptionMethod === "secretKey" && (
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(Password);
                    setSnackBarMessage(t("password_copied"));
                    showSnackBar();
                  }}
                  className={classes.button}
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
                  title="Create a link that has your public key"
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
                startIcon={<RefreshIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                {t("encrypt_another_file")}
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
};

export default LimitedEncryptionPanel;
