import { ThemeProvider } from "@mui/material/styles";
import { Theme } from "../src/config/Theme";
import NavAppBar from "../src/components/AppBar";
import Footer from "../src/components/Footer";
import Hero from "../src/components/Hero";
import Container from "@mui/material/Container";
import KeyPairGeneration from "../src/components/KeyPairGeneration";

const Generate = () => {
  return (
    <ThemeProvider theme={Theme}>
      <div
        style={{
          backgroundColor: Theme.palette.alabaster.main,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavAppBar />
        <Hero />
        <Container
          style={{
            maxWidth: "768px",
          }}
        >
          <KeyPairGeneration opened={true} />
        </Container>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Generate;
