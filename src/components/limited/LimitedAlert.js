import { useEffect, useState } from "react";

import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { getTranslations as t} from "../../../locales";


const LimitedAlert = () => {

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


    return (
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
            ? t('limited_safari')
            : browser === "mobile"
            ? t('limited_mobile')
            : t('limited_private')}
        </Alert>
      </Collapse>
    )
}

export default LimitedAlert
