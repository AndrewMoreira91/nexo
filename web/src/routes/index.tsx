import { createBrowserRouter } from "react-router";
import BaseLayout from "../pages/BaseLayout";
import DashboardPage from "../pages/Dashboard";
import Error404Page from "../pages/Error404";
import PomodoroPage from "../pages/Pomodoro";
import WelcomePage from "../pages/WelcomePage";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import ProtectRouteLayout from "./ProtectRoute";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <BaseLayout />,
		ErrorBoundary: Error404Page,
		children: [
			{
				index: true,
				element: <WelcomePage />,
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
				path: "/",
				element: <ProtectRouteLayout />,
				children: [
					{
						path: "/dashboard",
						element: <DashboardPage />,
					},
					{
						path: "/pomodoro",
						element: <PomodoroPage />,
					},
				],
			},
		],
	},
]);
