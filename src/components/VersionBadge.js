import { currentVersion } from "../config/Constants";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  chip: {
    backgroundColor: theme.palette.gallery.main,
    color: theme.palette.mountainMist.main,
    borderRadius: ".25rem",
    padding: "none",
    marginLeft: 15,
    marginBottom: 10,
  },
}));

const VersionBadge = () => {
  const classes = useStyles();
  return (
    <Chip className={classes.chip} label={"v" + currentVersion} size="small" />
  );
};

export default VersionBadge;
