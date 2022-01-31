import { useEffect, useState } from "react";
import MainContainer from "../src/views/MainContainer";
import LimitedContainer from "../src/views/LimitedContainer";
import { ThemeProvider } from "@material-ui/styles";
import { Theme } from "../src/config/Theme";
import LoadingCom from "../src/components/Loading";

const Home = () => {
  const [swReg, setSwReg] = useState();
  const [browserSupport, setBrowserSupport] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safariBrowser =
      /Safari/.test(navigator.userAgent) &&
      /Apple Computer/.test(navigator.vendor);
    const mobileBrowser =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (safariBrowser || mobileBrowser) {
      setBrowserSupport(false);
    } else {
      setBrowserSupport(true);
    }

    //register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("service-worker.js")
        .then((reg) => {
          reg.update();
          setSwReg(true);
          setLoading(false);
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed", err);
          setSwReg(false);
          setLoading(false);
        });
    } else {
      // console.log("did not register sw");
      setSwReg(false);
      setLoading(false);
    }
  }, []);

  return (
    <ThemeProvider theme={Theme}>
      <LoadingCom open={loading} />
      {!loading &&
        (swReg && browserSupport ? <MainContainer /> : <LimitedContainer />)}
    </ThemeProvider>
  );
};

export default Home;
