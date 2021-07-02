import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EncryptionPanel from "./EncryptionPanel";
import DecryptionPanel from "./DecryptionPanel";

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
    marginTop: 35,
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

export default function Panels() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Container className={classes.root}>
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
          <EncryptionPanel />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.TabPanel}>
          <DecryptionPanel />
        </TabPanel>
      </Container>
    </div>
  );
}
