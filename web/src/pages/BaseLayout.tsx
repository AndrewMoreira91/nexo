import { Snackbar } from "@mui/joy";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";

const BaseLayout = () => {
  const [snakbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    window.addEventListener("apiSlow", () => {
      setSnackbarOpen(true);
    });
  }, []);
  return (
    <div className="bg-background">
      <Snackbar
        open={snakbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        variant="solid"
        color="primary"
        size="lg"
      >
        <div className="flex flex-col gap-2 max-w-96">
          <span className="font-semibold text-2xl">
            Esta demorando um pouco né?
          </span>
          <span className="font-medium text-center text-gray-100">
            Nosso servidor gratuito pode demorar um pouco para responder às
            vezes 😅. Mas fique tranquilo, logo tudo volta ao normal! Se
            preferir, tente recarregar a página 😉.
          </span>
          <Button
            className="rounded-lg"
            type="button"
            theme="secondary"
            size="small"
            onClick={handleSnackbarClose}
          >
            Ok, eu te entendo!
          </Button>
        </div>
      </Snackbar>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default BaseLayout;
