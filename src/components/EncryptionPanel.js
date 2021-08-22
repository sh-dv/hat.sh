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
import CircularProgress from "@material-ui/core/CircularProgress";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Alert, AlertTitle } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { CHUNK_SIZE } from "../config/Constants";
import IdleTimerContainer from "./IdleTimerContainer";
import IconButton from "@material-ui/core/IconButton";
import CachedIcon from "@material-ui/icons/Cached";
import Tooltip from '@material-ui/core/Tooltip';
import { generatePassword } from "../utils/generatePassword";
import passwordStrengthCheck from "../utils/passwordStrengthCheck";

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

let file, index;

export default function EncryptionPanel() {
  const classes = useStyles();
  
  const [activeStep, setActiveStep] = useState(0);

  const [File, setFile] = useState();

  const [Password, setPassword] = useState();

  

  const [isDownloading, setIsDownloading] = useState(false);

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
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile();
    setPassword();
    file = null;
    index = null;
  };

  const generatedPassword = async () => {
    let generated = await generatePassword();
    setPassword(generated);
  }


  const handleFileInput = (selectedFile) => {
    file = selectedFile;
    // console.log("file inserted", file);
    setFile(selectedFile);
  };

  const handlePasswordInput = (selectedPassword) => {
    setPassword(selectedPassword);
  };

  const handleEncryptedFileDownload = (e) => {
    e.target.setAttribute("href", "/file?name=" + File.name + ".enc");
    // console.log("enc btn clicked");
    setIsDownloading(true);
    navigator.serviceWorker.ready.then((reg) => {
      let password = Password;
      // console.log(password);
      reg.active.postMessage({ cmd: "requestEncryption", password });
      // console.log("enc requested");
    });
  };

  const startEncryption = () => {
    // console.log("start encryption");
    // console.log("START WITH", file);
    navigator.serviceWorker.ready.then((reg) => {
      file
        .slice(0, CHUNK_SIZE)
        .arrayBuffer()
        .then((chunk) => {
          // console.log("unencrypted chunk:", chunk);
          index = CHUNK_SIZE;
          reg.active.postMessage(
            { cmd: "encryptFirstChunk", chunk, last: index >= file.size },
            [chunk]
          );
        });
    });
  };

  const continueEncryption = (e) => {
    // console.log("continue encryption at index", index, " with file", file);
    navigator.serviceWorker.ready.then((reg) => {
      file
        .slice(index, index + CHUNK_SIZE)
        .arrayBuffer()
        .then((chunk) => {
          index += CHUNK_SIZE;
          // console.log("unencrypted chunk:", chunk);
          e.source.postMessage(
            { cmd: "encryptRestOfChunks", chunk, last: index >= file.size },
            [chunk]
          );
        });
    });
  };

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (e) => {
      // console.log(e);
      switch (e.data.reply) {
        case "keysGenerated":
          // console.log("keys generated!");
          startEncryption();
          break;

        case "continueEncryption":
          // console.log("need to encrypt more chunks!");
          continueEncryption(e);
          break;

        case "encryptionFinished":
          // console.log("encrypted!");
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
                  onChange={(e) => handleFileInput(e.target.files[0])}
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
              <div>
                <Button
                  fullWidth
                  disabled={!File}
                  variant="contained"
                  onClick={handleNext}
                  className={classes.nextButton}
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
            {"Enter a password"}
          </StepLabel>
          <StepContent>
            <TextField
              required
              id="outlined-required"
              label="Required"
              placeholder="Password"
              helperText={Password ? "Password strength: " + passwordStrengthCheck(Password) : "Choose a strong Password"}
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
                      {"Next"}
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
            {"Download encrypted file"}
          </StepLabel>
          <StepContent>
            <Alert severity="success" icon={<LockOutlinedIcon />}>
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
                      href=""
                      style={{
                        color: "#fff",
                        textDecoration: "none",
                        width: "100%",
                      }}
                    >
                      {isDownloading ? "Downloading..." : "Encrypted File"}
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
        <Paper elevation={0} className={classes.resetContainer}>
          <Alert
            variant="outlined"
            severity="success"
            style={{ border: "none" }}
          >
            <AlertTitle>Success</AlertTitle>
            You have successfully downloaded the encrypted file!
          </Alert>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(Password);
                }}
                className={classes.button}
                variant="outlined"
                startIcon={<FileCopyIcon />}
                fullWidth
                style={{ textTransform: "none" }}
              >
                Copy Password
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={handleReset}
                className={classes.button}
                variant="outlined"
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

      {!isDownloading && <IdleTimerContainer />}
    </div>
  );
}
