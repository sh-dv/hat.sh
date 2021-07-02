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

  const handleFileInput = (selectedFile) => {
    file = selectedFile;
    console.log("file inserted", file);
    setFile(selectedFile);
  };

  const handlePasswordInput = (selectedPassword) => {
    setPassword(selectedPassword);
  };

  const handleEncryptedFileDownload = (e) => {
    e.target.setAttribute("href", "/file?name=" + File.name + ".enc");
    console.log("enc btn clicked");
    setIsDownloading(true);
    navigator.serviceWorker.ready.then((reg) => {
      let password = Password;
      console.log(password);
      reg.active.postMessage({ cmd: "requestEncryption", password });
      console.log("enc requested");
    });
  };

  const startEncryption = () => {
    console.log("start encryption");
    console.log("START WITH", file);
    navigator.serviceWorker.ready.then((reg) => {
      file
        .slice(0, CHUNK_SIZE)
        .arrayBuffer()
        .then((chunk) => {
          index = CHUNK_SIZE;
          reg.active.postMessage(
            { cmd: "encryptFirstChunk", chunk, last: index >= file.size },
            [chunk]
          );
        });
    });
  };

  const continueEncryption = (e) => {
    console.log("continue encryption at index", index, " with file", file);
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
        case "keysGenerated":
          console.log("keys generated!");
          startEncryption();
          break;

        case "continueEncryption":
          console.log("need to encrypt more chunks!");
          continueEncryption(e);
          break;

        case "encryptionFinished":
          console.log("encrypted!");
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
          <StepLabel>{"Choose a file to encrypt"}</StepLabel>
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
                  fullWidth
                  disabled={!File}
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {"Next"}
                </Button>
              </div>
            </div>
          </StepContent>
        </Step>

        <Step key={2}>
          <StepLabel>{"Enter a password"}</StepLabel>
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
                      disabled={!Password}
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
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
          <StepLabel>{"Download encrypted file"}</StepLabel>
          <StepContent>
            <Alert severity="success" icon={<LockOutlinedIcon />}>
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
        <Paper elevation={1} className={classes.resetContainer}>
          <Alert variant="outlined" severity="success">
            <AlertTitle>Success</AlertTitle>
            You have successfully downloaded the encrypted file!
          </Alert>

          <Grid container spacing={1}>
            <Grid item xs>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(Password);
                }}
                className={classes.button}
                variant="outlined"
                startIcon={<FileCopyIcon />}
                fullWidth
              >
                Decryption Password
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                onClick={handleReset}
                className={classes.button}
                variant="outlined"
                startIcon={<RefreshIcon />}
                fullWidth
              >
                Encrypt Another File
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </div>
  );
}
