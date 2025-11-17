import dynamic from "next/dynamic";
import { ThemeProvider } from "@material-ui/styles";
import { Theme } from "../src/config/Theme";
import NavAppBar from "../src/components/AppBar";
import Footer from "../src/components/Footer";
import Hero from "../src/components/Hero";
import Container from "@material-ui/core/Container";

// 🚀 Carga KeyPairGeneration sin SSR para evitar el error de prerender
const KeyPairGeneration = dynamic(
  () => import("../src/components/KeyPairGeneration"),
  { ssr: false }
);

const Generate = () => {
  return (
    <ThemeProvider theme={Theme}>
      <div
        style={{
          backgroundColor: Theme?.palette?.alabaster?.main || "#ffffff",
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
