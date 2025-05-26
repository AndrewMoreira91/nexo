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
		window.addEventListener("apiTimeout", () => {
			console.log("API request timed out");
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
				<div className="flex flex-col gap-2">
					<span className="font-semibold text-2xl">
						Esta demorando um pouco né?
					</span>
					<span className="font-medium text">
						Grana curta = servidor gratuito😞. Mas relaxa, ele funciona! Se a
						ansiedade apertar, um F5 pode apressar o coitado😅.
					</span>
					<Button
						className="rounded-lg"
						type="button"
						theme="secondary"
						size="small"
						onClick={handleSnackbarClose}
					>
						Ok, entendi!
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
