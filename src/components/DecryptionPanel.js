/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
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
import { formatBytes } from "../helpers/formatBytes";
import { formatName } from "../helpers/formatName";
import {
  crypto_secretstream_xchacha20poly1305_ABYTES,
  CHUNK_SIZE,
} from "../config/Constants";
import Backdrop from "@material-ui/core/Backdrop";
import { Alert, AlertTitle } from "@material-ui/lab";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import CircularProgress from "@material-ui/core/CircularProgress";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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

let file, index, decFileBuff;

export default function DecryptionPanel(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const [File, setFile] = useState();

  const [Password, setPassword] = useState();

  const [badFile, setbadFile] = useState(false);

  const [oldVersion, setOldVersion] = useState(false);

  const [wrongPassword, setWrongPassword] = useState(false);

  const [isTestingPassword, setIsTestingPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const {isDecrypting, changeIsDecrypting} = props;
  
  (isDownloading) ? changeIsDecrypting(true) : changeIsDecrypting(false)

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
    setWrongPassword(false);
    setbadFile(false);
    setOldVersion(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile();
    setPassword();
    setWrongPassword(false);
    setbadFile(false);
    setOldVersion(false);
    file = null;
    index = null;
  };

  const handleFileInput = (selectedFile) => {
    file = selectedFile;
    // console.log("file inserted", file);
    setFile(selectedFile);
  };

  const handlePasswordInput = (selectedPassword) => {
    setPassword(selectedPassword);
  };

  const testDecryption = () => {
    navigator.serviceWorker.ready.then((reg) => {
      setIsTestingPassword(true);
      let password = Password;
      Promise.all([
        file.slice(0, 11).arrayBuffer(), //signature
        file.slice(11, 27).arrayBuffer(), //salt
        file.slice(27, 51).arrayBuffer(), //header
        file
          .slice(
            51,
            51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
          )
          .arrayBuffer(), //17
      ]).then(([signature, salt, header, chunk]) => {
        decFileBuff = chunk; //for testing the dec password
        reg.active.postMessage({
          cmd: "requestTestDecryption",
          password,
          signature,
          salt,
          header,
          decFileBuff,
        });
      });
    });
  };

  const handleDecryptedFileDownload = (e) => {
    e.target.setAttribute("href", "/file?name=" + formatName(file.name));
    setIsDownloading(true);
    navigator.serviceWorker.ready.then((reg) => {
      let password = Password;
      // console.log(password);
      Promise.all([
        file.slice(0, 11).arrayBuffer(), //signature
        file.slice(11, 27).arrayBuffer(), //salt
        file.slice(27, 51).arrayBuffer(), //header
        file
          .slice(
            51,
            51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
          )
          .arrayBuffer(), //17
      ]).then(([signature, salt, header, chunk]) => {
        reg.active.postMessage({
          cmd: "requestDecryption",
          password,
          signature,
          salt,
          header,
        });
      });

      // console.log("dec requested");
    });
  };

  const startDecryption = () => {
    // console.log("start Decryption");
    // console.log("START WITH", file);
    navigator.serviceWorker.ready.then((reg) => {
      file
        .slice(
          51,
          51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
        )
        .arrayBuffer()
        .then((chunk) => {
          index =
            51 + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES;
          reg.active.postMessage(
            { cmd: "decryptFirstChunk", chunk, last: index >= file.size },
            [chunk]
          ); // transfer chunk ArrayBuffer to service worker
        });
    });
  };

  const continueDecryption = (e) => {
    // console.log("continue decryption at index", index, " with file", file);
    navigator.serviceWorker.ready.then((reg) => {
      file
        .slice(
          index,
          index + CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES
        )
        .arrayBuffer()
        .then((chunk) => {
          index += CHUNK_SIZE + crypto_secretstream_xchacha20poly1305_ABYTES;
          e.source.postMessage(
            { cmd: "decryptRestOfChunks", chunk, last: index >= file.size },
            [chunk]
          );
        });
    });
  };

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (e) => {
      // console.log(e);
      switch (e.data.reply) {
        case "wrongPassword":
          // console.log('wrong password');
          setWrongPassword(true);
          setIsTestingPassword(false);
          break;

        case "badFile":
          setbadFile(true);
          setIsTestingPassword(false);
          break;

        case "oldVersion":
          setOldVersion(true);
          setIsTestingPassword(false);
          break;

        case "readyToDecrypt":
          setIsTestingPassword(false);
          handleNext();
          break;

        case "decKeysGenerated":
          // console.log("dec keys generated!");
          startDecryption();
          break;

        case "continueDecryption":
          // console.log("need to decrypt more chunks!");
          continueDecryption(e);
          break;

        case "decryptionFinished":
          // console.log("decrypted!");
          setIsDownloading(false);
          handleNext();
          break;
      }
    });
  }, []);

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
            <div className="wrapper p-3" id="decFileWrapper">
              <div className="file-area" id="decFileArea">
                <Typography>
                  {File ? File.name : "Drag & Drop or Browse file"}
                </Typography>
                <Typography>{File ? formatBytes(File.size) : ""}</Typography>

                <input
                  {...getInputProps()}
                  className={classes.input}
                  id="dec-file"
                  type="file"
                  onChange={(e) => handleFileInput(e.target.files[0])}
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
              type={showPassword ? "text" : "password"}
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
                endAdornment: (
                  <Tooltip title="Show Password" placement="top">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
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
                      disabled={isTestingPassword || !Password}
                      variant="contained"
                      onClick={testDecryption}
                      className={classes.nextButton}
                      startIcon={
                        isTestingPassword && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )
                      }
                      fullWidth
                    >
                      {isTestingPassword ? "Testing Password..." : "Next"}
                    </Button>
                  </Grid>
                </Grid>
                <br />

                {badFile && (
                  <Alert severity="error">
                    This file was not encrypted using hat.sh or the file may be
                    corrupted!
                  </Alert>
                )}

                {oldVersion && (
                  <Alert severity="error">
                    This file was encrypted using an old version of hat.sh, you
                    can decrypt this file by visiting the v1 page.
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
          <StepContent>
            <Alert severity="success" icon={<LockOpenIcon />}>
              <strong>{File ? File.name : ""}</strong> was loaded successfully
              and ready to download!
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
                    disabled={isDownloading || !Password || !File}
                    variant="contained"
                    color="primary"
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
                      onClick={(e) => handleDecryptedFileDownload(e)}
                      href=""
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        width: "100%",
                      }}
                    >
                      {isDownloading ? "Downloading..." : "Decrypted File"}
                    </a>
                  </Button>
                </Grid>
              </Grid>
              <br />

              {isDownloading && (
                <Alert variant="outlined" severity="info">
                  {"Don't close the page while the file is downloading!"}
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
            You have successfully downloaded the Decrypted file!
          </Alert>

          <Button
            onClick={handleReset}
            className={classes.button}
            variant="outlined"
            startIcon={<RefreshIcon />}
            fullWidth
          >
            Decrypt Another File
          </Button>
        </Paper>
      )}

    </div>
  );
}
