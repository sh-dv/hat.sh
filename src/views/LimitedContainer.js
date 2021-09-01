import NavAppBar from "../components/AppBar";
import Hero from "../components/Hero";
import LimitedPanels from "../components/limited/LimitedPanels";
import Footer from "../components/Footer";

const LimitedContainer = () => {
  return (
    <>
      <NavAppBar />
      <Hero />
      <LimitedPanels />
      <Footer />
    </>
  );
};

export default LimitedContainer;
