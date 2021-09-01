import { useEffect, useState } from "react";
import MainContainer from "../src/views/MainContainer";
import LimitedContainer from "../src/views/LimitedContainer";

const Home = () => {
  const [swReg, setSwReg] = useState();
  const [browserSupport, setBrowserSupport] = useState();

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
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed", err);
          setSwReg(false);
        });
    } else {
      // console.log("did not register sw");
      setSwReg(false);
    }
  }, []);

  return (
    <>{swReg && browserSupport ? <MainContainer /> : <LimitedContainer />}</>
  );
};

export default Home;
