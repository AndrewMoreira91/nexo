import { createBrowserRouter } from "react-router";
import BaseLayout from "../pages/BaseLayout";
import DashboardPage from "../pages/Dashboard";
import Error404Page from "../pages/Error404";
import LoginPage from "../pages/Login";
import PomodoroPage from "../pages/Pomodoro";
import RegisterPage from "../pages/Register";
import WelcomePage from "../pages/WelcomePage";
import ProtectRouteLayout from "./ProtectRoute";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <BaseLayout />,
		errorElement: <Error404Page />,
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
						path: "/pomodoro",
						element: <PomodoroPage />,
					},
					{
						path: 'dashboard',
						element: <DashboardPage />,
					}
				]
			},
		]
	},
]);
