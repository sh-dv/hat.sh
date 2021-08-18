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
import CircularProgress from "@material-ui/core/CircularProgress";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Alert, AlertTitle } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { MAX_FILE_SIZE, SIGNATURE, CHUNK_SIZE } from "../../config/Constants";
import IconButton from "@material-ui/core/IconButton";
import CachedIcon from "@material-ui/icons/Cached";
import Tooltip from '@material-ui/core/Tooltip';

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
  limitedIndex,
  limitedSalt,
  limitedKey,
  limitedState,
  limitedHeader,
  limitedEncFileBuff;

const LimitedEncryptionPanel = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const [File, setFile] = useState();

  const [largeFile, setLargeFile] = useState(false);

  const [Password, setPassword] = useState();

  const [isEncrypting, setIsEncrypting] = useState(false);

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
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile();
    setPassword();
    setIsEncrypting(false);
    file = null;
    limitedEncFileBuff = null;
    limitedIndex = null;
  };

  const generatedPassword = async () => {
    await _sodium.ready;
    const sodium = _sodium;
    let gPassword = sodium.to_base64(sodium.randombytes_buf(16), sodium.base64_variants.URLSAFE_NO_PADDING);
    setPassword(gPassword);
  }

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

  const limitedEncKeyGenerator = async (password) => {
    await _sodium.ready;
    const sodium = _sodium;

    limitedSalt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    // console.log("salt", limitedSalt);

    limitedKey = sodium.crypto_pwhash(
      32,
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
    // console.log(encryptedChunk);

    limitedEncFileBuff.push(new Uint8Array(limitedEncryptedChunk));

    if (limitedLast) {
      handleFinishedEncryption();
    }

    if (!limitedLast) {
      // console.log("not yet, continue encryption", limitedEncryptedChunk);
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

  const requestLimitedEncryption = async () => {
    // console.log("start imited enc");
    await limitedEncKeyGenerator(Password);
    startLimitedEncryption(File);
  };

  const handleFinishedEncryption = () => {
    // console.log("encryptionFinished", limitedEncFileBuff);
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
          Drop file to encrypt
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
            {"Choose a file to encrypt"}
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
                    {File ? "Change File" : "Browse File"}
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
                className={classes.nextButton}
              >
                {"Next"}
              </Button>

              {largeFile && (
                <Alert severity="error" style={{ marginTop: 15 }}>
                  <strong>File is too big!</strong> Choose a file up to 1GB.
                </Alert>
              )}
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
            {"Enter a password"}
          </StepLabel>
          <StepContent>
            <TextField
              required
              id="outlined-required"
              label="Required"
              placeholder="Password"
              helperText="Choose a strong Password"
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
                  <Tooltip title="Generate Password" placement="top">
                    <IconButton onClick={generatedPassword}>
                      <CachedIcon />
                    </IconButton>
                  </Tooltip>
                ),
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
                      disabled={!Password}
                      variant="contained"
                      onClick={handleNext}
                      className={classes.nextButton}
                      fullWidth
                    >
                      {"next"}
                    </Button>
                  </Grid>
                </Grid>
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
            {"Encrypt file"}
          </StepLabel>
          <StepContent>
            <Alert severity="success" icon={<LockOutlinedIcon />}>
              <strong>{File ? File.name : ""}</strong> was loaded successfully
              and ready to encrypt!
            </Alert>

            <div className={classes.actionsContainer}>
              <Grid container spacing={1}>
                <Grid item>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    onClick={requestLimitedEncryption}
                    disabled={isEncrypting || !Password || !File}
                    variant="contained"
                    className={classes.nextButton}
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
                    {isEncrypting ? "Encrypting..." : "Encrypt File"}
                  </Button>
                </Grid>
              </Grid>
              <br />

              {isEncrypting && (
                <Alert variant="outlined" severity="info">
                  {"Don't close the page while the file is encrypting!"}
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
            <AlertTitle>Success</AlertTitle>
            The file was successfully encrypted!
          </Alert>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <Button
                onClick={handleEncryptedFileDownload}
                className={classes.nextButton}
                variant="contained"
                startIcon={<GetAppIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                Download File
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(Password);
                }}
                className={classes.button}
                startIcon={<FileCopyIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                Decryption Password
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={handleReset}
                className={classes.button}
                startIcon={<RefreshIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                Encrypt Another File
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
};

export default LimitedEncryptionPanel;
