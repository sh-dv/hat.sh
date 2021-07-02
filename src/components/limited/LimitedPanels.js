import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import LimitedEncryptionPanel from "./LimitedEncryptionPanel";
import LimitedDecryptionPanel from "./LimitedDecryptionPanel";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "768px",
  },

  bar: {
    marginTop: 15,
    backgroundColor: "#ebebeb",
    borderRadius: "8px",
  },

  TabPanel: {
    marginTop: 15,
  },

  tab: {
    padding: 15,
    color: "#3f3f3f",
  },
}));

export default function LimitedPanels() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [alertOpen, setAlertOpen] = useState(true);
  const [browser, setBrowser] = useState();

  useEffect(() => {
    const safariBrowser =
      /Safari/.test(navigator.userAgent) &&
      /Apple Computer/.test(navigator.vendor);

    const mobileBrowser =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    safariBrowser
      ? setBrowser("safari")
      : mobileBrowser
      ? setBrowser("mobile")
      : setBrowser("other");
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Container className={classes.root}>
        <Collapse in={alertOpen} style={{ marginTop: 35 }}>
          <Alert
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {browser === "safari"
              ? "Safari browsers have limited experience (max file size of 1GB)"
              : browser === "mobile"
              ? "Mobile browsers have limited experience (max file size of 1GB)"
              : "You have limited experience (max file size of 1GB) due to Private browsing."}
          </Alert>
        </Collapse>

        <AppBar position="static" className={classes.bar} elevation={0}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            TabIndicatorProps={{ style: { background: "#000" } }}
          >
            <Tab label="Encryption" className={classes.tab} />
            <Tab label="Decryption" className={classes.tab} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0} className={classes.TabPanel}>
          <LimitedEncryptionPanel />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.TabPanel}>
          <LimitedDecryptionPanel />
        </TabPanel>
      </Container>
    </div>
  );
}
