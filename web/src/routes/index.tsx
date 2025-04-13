import { createBrowserRouter } from "react-router";
import DashboardPage from "../pages/Dashboard";
import Error404Page from "../pages/Error404";
import LoginPage from "../pages/Login";
import PomodoroPage from "../pages/Pomodoro";
import RegisterPage from "../pages/Register";
import WelcomePage from "../pages/WelcomePage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <WelcomePage />,
		errorElement: <Error404Page />,
	},
	{
		path: "dashboard",
		element: <DashboardPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/pomodoro",
		element: <PomodoroPage />,
	},
]);
