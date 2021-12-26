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
import LimitedAlert from "./LimitedAlert";

import { getTranslations as t } from "../../../locales";

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
      backgroundColor: theme.palette.white.main,
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
    backgroundColor: theme.palette.gallery.main,
    borderRadius: "8px",
    padding: 8,
  },

  TabPanel: {
    marginTop: 15,
  },

  tab: {
    color: theme.palette.emperor.main,
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
      {children}
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
  const encryption = { tab: 0, label: t('encryption') };
  const decryption = { tab: 1, label: t('decryption') };


  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.replace(router.pathname);
  };

  useEffect(() => {

    if (query.tab && query.tab === "encryption") {
      setValue(encryption.tab);
    }

    if (query.tab && query.tab === "decryption") {
      setValue(decryption.tab);
    }

  }, [decryption.tab, encryption.tab, query.tab]);

  return (
    <>
      <Container className={classes.root}>
        <LimitedAlert />
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
