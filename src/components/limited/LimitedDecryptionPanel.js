/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import Grid from "@material-ui/core/Grid";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DescriptionIcon from "@material-ui/icons/Description";
import GetAppIcon from "@material-ui/icons/GetApp";
import TextField from "@material-ui/core/TextField";
import { formatBytes } from "../../helpers/formatBytes";
import {
  crypto_secretstream_xchacha20poly1305_ABYTES,
  MAX_FILE_SIZE,
  CHUNK_SIZE,
  sigCode,
  decoder,
} from "../../config/Constants";
import Backdrop from "@material-ui/core/Backdrop";
import { Alert, AlertTitle } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import RefreshIcon from "@material-ui/icons/Refresh";
const _sodium = require("libsodium-wrappers");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  stepper: {
    backgroundColor: "transparent",
  },

  stepIcon: {
    "&$activeStepIcon": {
      color: "#525252",
    },
    "&$completedStepIcon": {
      color: "#525252",
    },
  },
  activeStepIcon: {},
  completedStepIcon: {},

  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    border: "none",
    color: "#3f3f3f",
    backgroundColor: "#f3f3f3",
    "&:hover": {
      backgroundColor: "#e9e9e9",
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
    color: "#3f3f3f",
    backgroundColor: "#e1e1e1",
    "&:hover": {
      backgroundColor: "#d2d2d2",
    },
    transition: "background-color 0.2s ease-out",
    transition: "color .01s",
  },

  backButton: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    backgroundColor: "#e9e9e9",
    transition: "color .01s",
  },
  nextButton: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: "8px",
    backgroundColor: "#464653",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#3f3f3f",
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
      color: "#525252",
    },
  },
  textFieldLabelFocused: {},

  textFieldRoot: {
    // this will be applied when hovered (input text color change)
    "&:hover": {
      color: "#525252",
    },
    // this will applied when hovered (input border color change)
    "&:hover $textFieldNotchedOutline": {
      borderColor: "#525252",
    },
    // this will be applied when focused (input border color change)
    "&$textFieldFocused $textFieldNotchedOutline": {
      borderColor: "#525252",
    },
  },
  textFieldFocused: {},
  textFieldNotchedOutline: {},
}));

let file,

  limitedDecIndex,
  limitedTestDecFileBuff,
  limitedDecFileBuff;

const LimitedDecryptionPanel = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const [File, setFile] = useState();
  const [largeFile, setLargeFile] = useState(false);

  const [Password, setPassword] = useState();

  const [badFile, setbadFile] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const [isTestingPassword, setIsTestingPassword] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

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
    setbadFile(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile();
    setPassword();
    setWrongPassword(false);
    setbadFile(false);
    file = null;
    limitedDecIndex = null;
  };

  const handleLimitedFileInput = (selectedFile) => {
    file = selectedFile;
    // console.log("file inserted", file);

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

  const testLimitedDecryption = async () => {
    setIsTestingPassword(true);

    await _sodium.ready;
    const sodium = _sodium;

    file = File;
    let limitedTestPassword = Password;

    Promise.all([
      file.slice(0, 11).arrayBuffer(), //signature
      file.slice(11, 27).arrayBuffer(), //salt
      file.slice(27, 51).arrayBuffer(), //header
      file
        .slice(
          51,
          51 + CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES
        )
        .arrayBuffer(),
    ]).then(
      ([
        limitedTestSignature,
        limitedTestSalt,
        limitedTestHeader,
        limitedTestChunk,
      ]) => {
        limitedTestDecFileBuff = limitedTestChunk; //for testing the dec password

        if (decoder.decode(limitedTestSignature) === sigCode) {
          let decLimitedTestsalt = new Uint8Array(limitedTestSalt);
          let decLimitedTestheader = new Uint8Array(limitedTestHeader);

          let decLimitedTestKey = sodium.crypto_pwhash(
            32,
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
              // console.log('good key');
              // console.log('ready to decrypt!');

              limitedDecKeyGenerator(
                limitedTestPassword,
                limitedTestSignature,
                limitedTestSalt,
                limitedTestHeader
              );
            } else {
              setIsTestingPassword(false);
              setWrongPassword(true);
            }
          }
        } else {
          setIsTestingPassword(false);
          setbadFile(true);
        }
      }
    );
  };

  const limitedDecKeyGenerator = async (password, signautre, salt, header) => {
    await _sodium.ready;
    const sodium = _sodium;

    file = File;

    if (decoder.decode(signautre) === sigCode) {
      let limitedDecSalt = new Uint8Array(salt);
      let limitedDecHeader = new Uint8Array(header);

      let limitedDecKey = sodium.crypto_pwhash(
        32,
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
        // console.log("limited dec keys generated");

        startLimitedDecryption(limitedDecState);
      }
    } else {
      badLimitedFile();
    }
  };

  const startLimitedDecryption = (dec_state) => {
    // console.log('start decrypt');
    setIsDecrypting(true);

    limitedDecFileBuff = [];

    file = File;

    file
      .slice(51, 51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES)
      .arrayBuffer()
      .then((chunk) => {
        limitedDecIndex =
          51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES;
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
      // console.log('good key');
      let limitedDecryptedChunk = limitedDecResult.message;
      // console.log("decrypted chunk", limitedDecryptedChunk);

      limitedDecFileBuff.push(new Uint8Array(limitedDecryptedChunk));

      if (limitedDecLast) {
        handleFinishedDecryption();
        // showLimitedDecModal();
      }
      if (!limitedDecLast) {
        // console.log("continue decryption");
        continueLimitedDecryption(dec_state);
      }
    } else {
      setWrongPassword(true);
      setIsTestingPassword(false);
    }
  };

  const handleFinishedDecryption = () => {
    // console.log("decryption finished", limitedDecFileBuff);
    handleNext();
    setIsDecrypting(false);
  };

  const handleDecryptedFileDownload = () => {
    let fileName = File.name.slice(0, -4);

    let blob = new Blob(limitedDecFileBuff);

    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={classes.root} {...getRootProps()}>
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
          Drop file to decrypt
        </Typography>
      </Backdrop>

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
            {"Choose a file to decrypt"}
          </StepLabel>
          <StepContent>
            <div className="wrapper p-3" id="encFileWrapper">
              <div className="file-area" id="encFileArea">
                <Typography>
                  {File ? File.name : "Drag & Drop or Browse file"}
                </Typography>
                <Typography>{File ? formatBytes(File.size) : ""}</Typography>

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
                    {File ? "Change File" : "Browse File"}
                  </Button>
                </label>
              </div>
            </div>

            <div className={classes.actionsContainer}>
              <div>
                <Button
                  disabled={!File}
                  variant="contained"
                  onClick={handleNext}
                  className={classes.nextButton}
                  fullWidth
                >
                  {"Next"}
                </Button>

                {largeFile && (
                  <Alert severity="error" style={{ marginTop: 15 }}>
                    <strong>File is too big!</strong> Choose a file up to 1GB.
                  </Alert>
                )}
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
            {"Enter the decryption password"}
          </StepLabel>
          <StepContent>
            <TextField
              required
              error={wrongPassword ? true : false}
              id={
                wrongPassword
                  ? "outlined-error-helper-text"
                  : "outlined-required"
              }
              label={wrongPassword ? "Error" : "Required"}
              helperText={wrongPassword ? "Wrong Password" : ""}
              placeholder="Password"
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
              }}
            />

            <div className={classes.actionsContainer}>
              <div>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.backButton}
                      fullWidth
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs>
                    <Button
                      disabled={isTestingPassword || isDecrypting || !Password}
                      variant="contained"
                      onClick={testLimitedDecryption}
                      className={classes.nextButton}
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
                        ? "Testing Password..."
                        : isDecrypting
                        ? "Decrypting..."
                        : "Next"}
                    </Button>
                  </Grid>
                </Grid>
                <br />

                {badFile && (
                  <Alert severity="error">
                    This file was not encrypted using hat.sh v2 or the file may
                    be corrupted!
                  </Alert>
                )}

                {isDecrypting && (
                  <Alert variant="outlined" severity="info">
                    {"Don't close the page while the file is decrypting!"}
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
            {"Download decrypted file"}
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
            <AlertTitle>Success</AlertTitle>
            The file was successfully Decrypted!
          </Alert>

          <Grid container spacing={1} style={{ marginTop: 5 }}>
            <Grid item xs={12}>
              <Button
                onClick={handleDecryptedFileDownload}
                color="primary"
                className={classes.nextButton}
                variant="contained"
                startIcon={<GetAppIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                Download File
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
                Decrypt Another File
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
};

export default LimitedDecryptionPanel;
