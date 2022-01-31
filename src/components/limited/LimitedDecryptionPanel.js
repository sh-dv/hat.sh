/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { formatBytes } from "../../helpers/formatBytes";
import { formatName } from "../../helpers/formatName";
import {
  crypto_secretstream_xchacha20poly1305_ABYTES,
  MAX_FILE_SIZE,
  CHUNK_SIZE,
  SIGNATURES,
  decoder,
} from "../../config/Constants";
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
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Collapse from "@material-ui/core/Collapse";
import RefreshIcon from "@material-ui/icons/Refresh";
import DescriptionIcon from "@material-ui/icons/Description";
import GetAppIcon from "@material-ui/icons/GetApp";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AttachFileIcon from "@material-ui/icons/AttachFile";
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
  limitedDecIndex,
  limitedTestDecFileBuff,
  limitedDecFileBuff,
  decRx,
  decTx;

const LimitedDecryptionPanel = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);

  const router = useRouter();

  const query = router.query;

  const [File, setFile] = useState();

  const [largeFile, setLargeFile] = useState(false);

  const [Password, setPassword] = useState();

  const [decryptionMethod, setDecryptionMethod] = useState("secretKey");

  const [PublicKey, setPublicKey] = useState();

  const [PrivateKey, setPrivateKey] = useState();

  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const [wrongPublicKey, setWrongPublicKey] = useState(false);

  const [wrongPrivateKey, setWrongPrivateKey] = useState(false);

  const [keysError, setKeysError] = useState(false);

  const [keysErrorMessage, setKeysErrorMessage] = useState();

  const [isCheckingFile, setIsCheckingFile] = useState(false);

  const [badFile, setbadFile] = useState(false);

  const [oldVersion, setOldVersion] = useState(false);

  const [wrongPassword, setWrongPassword] = useState(false);

  const [isTestingPassword, setIsTestingPassword] = useState(false);

  const [isTestingKeys, setIsTestingKeys] = useState(false);

  const [isDecrypting, setIsDecrypting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
    setWrongPassword(false);
    setWrongPublicKey(false);
    setWrongPrivateKey(false);
    setKeysError(false);
    setIsTestingKeys(false);
    setIsTestingPassword(false);
    setIsDecrypting(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile();
    setPassword();
    setWrongPassword(false);
    setbadFile(false);
    setOldVersion(false);
    setPublicKey();
    setPrivateKey();
    setWrongPublicKey(false);
    setWrongPrivateKey(false);
    setKeysError(false);
    setPkAlert(false);
    file = null;
    limitedDecIndex = null;
    (decRx = null), (decTx = null);
    router.replace(router.pathname);
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

    setbadFile(false);
    setOldVersion(false);
  };

  const removeFile = () => {
    setFile();
    setbadFile(false);
    setOldVersion(false);
  }

  const checkFile = () => {
    setIsCheckingFile(true);
    setbadFile(false);
    setOldVersion(false);

    Promise.all([
      file.slice(0, 11).arrayBuffer(), //signatures
      file.slice(0, 22).arrayBuffer(), //v1 signature
    ]).then(([signature, legacy]) => {
      if (decoder.decode(signature) === SIGNATURES["v2_symmetric"]) {
        setDecryptionMethod("secretKey");
        setActiveStep(1);
        setIsCheckingFile(false);
      } else if (decoder.decode(signature) === SIGNATURES["v2_asymmetric"]) {
        setDecryptionMethod("publicKey");
        setActiveStep(1);
        setIsCheckingFile(false);
      } else if (decoder.decode(legacy) === SIGNATURES["v1"]) {
        setOldVersion(true);
        setIsCheckingFile(false);
      } else {
        setbadFile(true);
        setIsCheckingFile(false);
      }
    });
  };

  const handlePasswordInput = (selectedPassword) => {
    setPassword(selectedPassword);
    setWrongPassword(false);
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
      }
    }
  };

  const requestDecKeyPair = async (ssk, cpk, header, decFileBuff) => {
    await _sodium.ready;
    const sodium = _sodium;

    try {
      let keyFromkeypair = sodium.crypto_kx_server_session_keys(
        sodium.crypto_scalarmult_base(sodium.from_base64(ssk)),
        sodium.from_base64(ssk),
        sodium.from_base64(cpk)
      );

      if (keyFromkeypair) {
        [decRx, decTx] = [keyFromkeypair.sharedRx, keyFromkeypair.sharedTx];
        if (decRx && decTx) {
          let limitedDecState =
            sodium.crypto_secretstream_xchacha20poly1305_init_pull(
              new Uint8Array(header),
              decRx
            );

          if (limitedDecState) {
            setIsTestingKeys(false);
            setIsTestingPassword(false);
            startLimitedDecryption("publicKey", limitedDecState);
          }
        }
      }
    } catch (error) {
      setKeysError(true);
      setKeysErrorMessage(t("invalid_keys_input"));
      setIsTestingKeys(false);
    }
  };

  const testLimitedDecryption = async () => {
    await _sodium.ready;
    const sodium = _sodium;

    if (decryptionMethod === "secretKey") {
      setIsTestingPassword(true);

      file = File;
      let limitedTestPassword = Password;

      Promise.all([
        file.slice(11, 27).arrayBuffer(), //salt
        file.slice(27, 51).arrayBuffer(), //header
        file
          .slice(
            51,
            51 +
              CHUNK_SIZE +
              sodium.crypto_secretstream_xchacha20poly1305_ABYTES
          )
          .arrayBuffer(),
      ]).then(([limitedTestSalt, limitedTestHeader, limitedTestChunk]) => {
        limitedTestDecFileBuff = limitedTestChunk; //for testing the dec password

        let decLimitedTestsalt = new Uint8Array(limitedTestSalt);
        let decLimitedTestheader = new Uint8Array(limitedTestHeader);

        let decLimitedTestKey = sodium.crypto_pwhash(
          sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
          limitedTestPassword,
          decLimitedTestsalt,
          sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
          sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
          sodium.crypto_pwhash_ALG_ARGON2ID13
        );

        let limitedTestState =
          sodium.crypto_secretstream_xchacha20poly1305_init_pull(
            decLimitedTestheader,
            decLimitedTestKey
          );

        if (limitedTestState) {
          let decLimitedTestresults =
            sodium.crypto_secretstream_xchacha20poly1305_pull(
              limitedTestState,
              new Uint8Array(limitedTestDecFileBuff)
            );
          if (decLimitedTestresults) {
            setIsTestingPassword(false);

            limitedDecKeyGenerator(
              limitedTestPassword,
              limitedTestSalt,
              limitedTestHeader
            );
          } else {
            setIsTestingPassword(false);
            setWrongPassword(true);
          }
        }
      });
    }

    if (decryptionMethod === "publicKey") {
      // requestDecKeyPair()
      setKeysError(false);
      setWrongPrivateKey(false);
      setWrongPublicKey(false);
      setIsTestingKeys(true);

      file = File;
      let ssk = PrivateKey;
      let cpk = PublicKey;

      Promise.all([
        file.slice(11, 35).arrayBuffer(), //header
        file
          .slice(
            35,
            35 +
              CHUNK_SIZE +
              sodium.crypto_secretstream_xchacha20poly1305_ABYTES
          )
          .arrayBuffer(),
      ]).then(([limitedTestHeader, limitedTestChunk]) => {
        limitedTestDecFileBuff = limitedTestChunk; //for testing the dec password

        let decLimitedTestheader = new Uint8Array(limitedTestHeader);

        try {
          let computed = sodium.crypto_scalarmult_base(sodium.from_base64(ssk));
          computed = sodium.to_base64(computed);
          if (ssk === cpk || cpk === computed) {
            setKeysError(true);
            setKeysErrorMessage(t("invalid_key_pair"));
            setIsTestingKeys(false);
            return;
          }

          if (
            sodium.from_base64(ssk).length !== sodium.crypto_kx_SECRETKEYBYTES
          ) {
            setWrongPrivateKey(true);
            setIsTestingKeys(false);
            return;
          }

          if (
            sodium.from_base64(cpk).length !== sodium.crypto_kx_PUBLICKEYBYTES
          ) {
            setWrongPublicKey(true);
            setIsTestingKeys(false);
            return;
          }

          let limitedDecKey = sodium.crypto_kx_server_session_keys(
            sodium.crypto_scalarmult_base(sodium.from_base64(ssk)),
            sodium.from_base64(ssk),
            sodium.from_base64(cpk)
          );

          if (limitedDecKey) {
            [decRx, decTx] = [limitedDecKey.sharedRx, limitedDecKey.sharedTx];

            if (decRx && decTx) {
              let limitedDecState =
                sodium.crypto_secretstream_xchacha20poly1305_init_pull(
                  new Uint8Array(decLimitedTestheader),
                  decRx
                );

              if (limitedDecState) {
                let decTestresults =
                  sodium.crypto_secretstream_xchacha20poly1305_pull(
                    limitedDecState,
                    new Uint8Array(limitedTestDecFileBuff)
                  );

                if (decTestresults) {
                  setIsTestingKeys(false);
                  setIsTestingPassword(false);
                  requestDecKeyPair(
                    ssk,
                    cpk,
                    decLimitedTestheader,
                    limitedTestDecFileBuff
                  );
                } else {
                  setWrongPublicKey(true);
                  setWrongPrivateKey(true);
                  setIsTestingKeys(false);
                }
              }
            }
          }
        } catch (error) {
          setKeysError(true);
          setKeysErrorMessage(t("invalid_keys_input"));
          setIsTestingKeys(false);
        }
      });
    }
  };

  const limitedDecKeyGenerator = async (password, salt, header) => {
    await _sodium.ready;
    const sodium = _sodium;

    file = File;

    let limitedDecSalt = new Uint8Array(salt);
    let limitedDecHeader = new Uint8Array(header);

    let limitedDecKey = sodium.crypto_pwhash(
      sodium.crypto_secretstream_xchacha20poly1305_KEYBYTES,
      password,
      limitedDecSalt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    let limitedDecState =
      sodium.crypto_secretstream_xchacha20poly1305_init_pull(
        limitedDecHeader,
        limitedDecKey
      );

    if (limitedDecState) {
      startLimitedDecryption("secretKey", limitedDecState);
    }
  };

  const startLimitedDecryption = (method, dec_state) => {
    let startIndex;
    if (method === "secretKey") startIndex = 51;
    if (method === "publicKey") startIndex = 35;

    setIsDecrypting(true);

    limitedDecFileBuff = [];

    file = File;

    file
      .slice(
        startIndex,
        startIndex + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
      )
      .arrayBuffer()
      .then((chunk) => {
        limitedDecIndex =
          startIndex +
          CHUNK_SIZE +
          crypto_secretstream_xchacha20poly1305_ABYTES;
        let limitedDecLast = limitedDecIndex >= file.size;
        limitedChunkDecryption(limitedDecLast, chunk, dec_state);
      });
  };

  const continueLimitedDecryption = (dec_state) => {
    file = File;

    file
      .slice(
        limitedDecIndex,
        limitedDecIndex +
          CHUNK_SIZE +
          crypto_secretstream_xchacha20poly1305_ABYTES
      )
      .arrayBuffer()
      .then((chunk) => {
        limitedDecIndex +=
          CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES;
        let limitedDecLast = limitedDecIndex >= file.size;
        limitedChunkDecryption(limitedDecLast, chunk, dec_state);
      });
  };

  const limitedChunkDecryption = async (limitedDecLast, chunk, dec_state) => {
    await _sodium.ready;
    const sodium = _sodium;

    let limitedDecResult = sodium.crypto_secretstream_xchacha20poly1305_pull(
      dec_state,
      new Uint8Array(chunk)
    );

    if (limitedDecResult) {
      let limitedDecryptedChunk = limitedDecResult.message;

      limitedDecFileBuff.push(new Uint8Array(limitedDecryptedChunk));

      if (limitedDecLast) {
        handleFinishedDecryption();
        // showLimitedDecModal();
      }
      if (!limitedDecLast) {
        continueLimitedDecryption(dec_state);
      }
    } else {
      setWrongPassword(true);
      setIsTestingPassword(false);
    }
  };

  const handleFinishedDecryption = () => {
    handleNext();
    setIsDecrypting(false);
  };

  const handleDecryptedFileDownload = () => {
    let fileName = formatName(File.name);

    let blob = new Blob(limitedDecFileBuff);

    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  };

  useEffect(() => {
    if (query.tab === "decryption" && query.publicKey) {
      setPublicKey(query.publicKey);
      setPkAlert(true);
      setDecryptionMethod("publicKey");
    }
  }, [query.publicKey, query.tab]);

  return (
    <div className={classes.root} {...getRootProps()}>
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
          {t("drop_file_dec")}
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
          {t("sender_key_loaded")}
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
            {t("choose_file_dec")}
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
                            onClick={() => removeFile()}
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
                  id="dec-file"
                  type="file"
                  onChange={(e) => handleLimitedFileInput(e.target.files[0])}
                />
                <label htmlFor="dec-file">
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
              <div>
                <Button
                  disabled={isCheckingFile || !File}
                  variant="contained"
                  onClick={checkFile}
                  className={`${classes.nextButton} nextBtnHs`}
                  startIcon={
                    isCheckingFile && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )
                  }
                  fullWidth
                >
                  {isCheckingFile ? t("checking_file") : t("next")}
                </Button>

                {largeFile && (
                  <>
                    <Alert severity="error" style={{ marginTop: 15 }}>
                      <strong>{t("file_too_big")}</strong>{" "}
                      {t("choose_file_1gb")}
                    </Alert>
                  </>
                )}
              </div>

              {badFile && (
                <Alert severity="error" style={{ marginTop: 15 }}>
                  {t("file_not_encrypted_corrupted")}
                </Alert>
              )}

              {oldVersion && (
                <Alert severity="error" style={{ marginTop: 15 }}>
                  {t("old_version")}{" "}
                  <a href="https://v1.hat.sh/" target="_blank" rel="noreferrer">
                    {"https://v1.hat.sh"}
                  </a>
                </Alert>
              )}
            </div>

            {!badFile && !oldVersion && !largeFile && (
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
            {decryptionMethod === "secretKey"
              ? t("enter_password_dec")
              : t("enter_keys_dec")}
          </StepLabel>
          <StepContent>
            {decryptionMethod === "secretKey" && (
              <TextField
                required
                type={showPassword ? "text" : "password"}
                error={wrongPassword ? true : false}
                id={
                  wrongPassword
                    ? "outlined-error-helper-text"
                    : "outlined-required"
                }
                label={wrongPassword ? t("error") : t("required")}
                helperText={wrongPassword ? t("wrong_password") : ""}
                placeholder={t("password")}
                variant="outlined"
                value={Password ? Password : ""}
                onChange={(e) => handlePasswordInput(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Tooltip title={t("show_password")} placement="left">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            )}

            {decryptionMethod === "publicKey" && (
              <>
                <TextField
                  required
                  error={wrongPublicKey || keysError ? true : false}
                  helperText={wrongPublicKey ? t("wrong_public_key") : ""}
                  label={t("sender_public_key")}
                  placeholder={t("enter_sender_public_key")}
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
                          id="dec-public-key-file"
                          type="file"
                          onChange={(e) => loadPublicKey(e.target.files[0])}
                        />
                        <label htmlFor="dec-public-key-file">
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
                  error={wrongPrivateKey || keysError ? true : false}
                  helperText={wrongPrivateKey ? t("wrong_private_key") : ""}
                  label={t("your_private_key_dec")}
                  placeholder={t("enter_private_key_dec")}
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
                          id="dec-private-key-file"
                          type="file"
                          onChange={(e) => loadPrivateKey(e.target.files[0])}
                        />
                        <label htmlFor="dec-private-key-file">
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
              </>
            )}

            <div className={classes.actionsContainer}>
              <div>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button
                      disabled={
                        activeStep === 0 ||
                        isTestingPassword ||
                        isTestingKeys ||
                        isDecrypting
                      }
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
                        (decryptionMethod === "secretKey" && !Password) ||
                        (decryptionMethod === "publicKey" &&
                          (!PublicKey || !PrivateKey)) ||
                        isTestingPassword ||
                        isTestingKeys ||
                        isDecrypting
                      }
                      variant="contained"
                      onClick={testLimitedDecryption}
                      className={`${classes.nextButton} nextBtnHs`}
                      startIcon={
                        (isTestingPassword || isDecrypting) && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )
                      }
                      fullWidth
                    >
                      {isTestingPassword
                        ? t("testing_password")
                        : isTestingKeys
                        ? t("testing_keys")
                        : isDecrypting
                        ? t("decrypting_file")
                        : t("next")}
                    </Button>
                  </Grid>
                </Grid>
                <br />

                {decryptionMethod === "publicKey" && keysError && (
                  <Alert severity="error">{keysErrorMessage}</Alert>
                )}

                {isDecrypting && (
                  <Alert variant="outlined" severity="info">
                    {t("page_close_alert_dec")}
                  </Alert>
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
            {t("download_decrypted_file")}
          </StepLabel>
        </Step>
      </Stepper>

      {activeStep === 2 && (
        <Paper elevation={1} className={classes.resetContainer}>
          <Alert
            variant="outlined"
            severity="success"
            style={{ border: "none" }}
          >
            <AlertTitle>{t("success")}</AlertTitle>
            {t("success_decrypted")}
          </Alert>

          <Grid container spacing={1} style={{ marginTop: 5 }}>
            <Grid item xs={12}>
              <Button
                onClick={handleDecryptedFileDownload}
                color="primary"
                className={`${classes.nextButton} nextBtnHs`}
                variant="contained"
                startIcon={<GetAppIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                {t("download_file")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleReset}
                className={classes.button}
                variant="outlined"
                startIcon={<RefreshIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                {t("decrypt_another_file")}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
};

export default LimitedDecryptionPanel;
