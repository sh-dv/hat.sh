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
import {
  crypto_secretstream_xchacha20poly1305_ABYTES,
  CHUNK_SIZE,
} from "../config/Constants";
import Backdrop from "@material-ui/core/Backdrop";
import { Alert, AlertTitle } from "@material-ui/lab";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import CircularProgress from "@material-ui/core/CircularProgress";
import RefreshIcon from "@material-ui/icons/Refresh";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  stepper: {
    backgroundColor: "transparent",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },

  input: {
    display: "none",
  },
}));

let file, index, decFileBuff;

export default function EncryptionPanel() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const [File, setFile] = useState();

  const [Password, setPassword] = useState();

  const [badFile, setbadFile] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const [isTestingPassword, setIsTestingPassword] = useState(false);

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
    index = null;
  };

  const handleFileInput = (selectedFile) => {
    file = selectedFile;
    console.log("file inserted", file);
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
    e.target.setAttribute("href", "/file?name=" + file.name.slice(0, -4));
    setIsDownloading(true);
    navigator.serviceWorker.ready.then((reg) => {
      let password = Password;
      console.log(password);
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

      console.log("dec requested");
    });
  };

  const startDecryption = () => {
    console.log("start Decryption");
    console.log("START WITH", file);
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
    console.log("continue decryption at index", index, " with file", file);
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
    if (File && Password) {
      console.log("yes there is a password", Password, "and file", File);
    } else {
      console.log("no file");
    }
  });

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (e) => {
      console.log(e);
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

        case "readyToDecrypt":
          setIsTestingPassword(false);
          handleNext();
          break;

        case "decKeysGenerated":
          console.log("dec keys generated!");
          startDecryption();
          break;

        case "continueDecryption":
          console.log("need to decrypt more chunks!");
          continueDecryption(e);
          break;

        case "decryptionFinished":
          console.log("decrypted!");
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
          <StepLabel>{"Choose a file to decrypt"}</StepLabel>
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
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => handleFileInput(e.target.files[0])}
                />
                <label htmlFor="contained-button-file">
                  <br />
                  <Button
                    variant="contained"
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
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  fullWidth
                >
                  {"Next"}
                </Button>
              </div>
            </div>
          </StepContent>
        </Step>

        <Step key={2}>
          <StepLabel>{"Enter the decryption password"}</StepLabel>
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
            />

            <div className={classes.actionsContainer}>
              <div>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                      fullWidth
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs>
                    <Button
                      disabled={isTestingPassword || !Password}
                      variant="contained"
                      color="primary"
                      onClick={testDecryption}
                      className={classes.button}
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
                    This file was not encrypted using hat.sh v2 or the file may
                    be corrupted!
                  </Alert>
                )}
              </div>
            </div>
          </StepContent>
        </Step>

        <Step key={3}>
          <StepLabel>{"Download decrypted file"}</StepLabel>
          <StepContent>
            <Alert severity="success" icon={<LockOpenIcon />}>
              <strong>{File ? File.name : ""}</strong> was loaded successfully
              and ready to download!
            </Alert>

            <div className={classes.actionsContainer}>
              <Grid container spacing={1}>
                <Grid item>
                  <Button
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button
                    disabled={isDownloading || !Password || !File}
                    variant="contained"
                    color="primary"
                    className={classes.button}
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
          <Alert variant="outlined" severity="success">
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
