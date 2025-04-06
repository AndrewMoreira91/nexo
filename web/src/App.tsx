import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/auth.context";
import { router } from "./routes";

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
