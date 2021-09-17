import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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

const StyledTabs = withStyles({
  indicator: {
    display: "none",
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    padding: "8px",
    transition: "background-color 0.2s ease-out",

    "&$selected": {
      backgroundColor: "#fff",
      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      borderRadius: "8px",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "768px",
  },

  bar: {
    marginTop: 15,
    backgroundColor: "#ebebeb",
    borderRadius: "8px",
    padding: 8,
  },

  TabPanel: {
    marginTop: 15,
  },

  tab: {
    color: "#3f3f3f",
  },
}));

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

export default function LimitedPanels() {
  const classes = useStyles();
  const router = useRouter();
  const query = router.query;
  const [value, setValue] = useState(0);
  const encryption = { tab: 0, label: "Encryption" };
  const decryption = { tab: 1, label: "Decryption" };
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
    router.replace(router.pathname);
  };

  useEffect(() => {
    if (query.tab && query.tab === decryption.label.toLowerCase()) {
      setValue(decryption.tab);
    }
  }, [decryption.label, decryption.tab, query.publicKey, query.tab]);

  return (
    <>
      <Container className={classes.root}>
        <Collapse in={alertOpen} style={{ marginTop: 5 }}>
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
          <StyledTabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            centered
          >
            <StyledTab label={encryption.label} className={classes.tab} />
            <StyledTab label={decryption.label} className={classes.tab} />
          </StyledTabs>
        </AppBar>

        <TabPanel
          value={value}
          index={encryption.tab}
          className={classes.TabPanel}
        >
          <LimitedEncryptionPanel />
        </TabPanel>
        <TabPanel
          value={value}
          index={decryption.tab}
          className={classes.TabPanel}
        >
          <LimitedDecryptionPanel />
        </TabPanel>
      </Container>
    </>
  );
}
