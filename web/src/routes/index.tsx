import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import BaseLayout from "../pages/BaseLayout";
import DashboardPage from "../pages/Dashboard";
import Error404Page from "../pages/Error404";
import PomodoroPage from "../pages/Pomodoro";
import SettingsPage from "../pages/Settings";
import { StatisticsPage } from "../pages/Statistics";
import StepsPage from "../pages/steps/Steps";
import WelcomePage from "../pages/WelcomePage";
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
        path: "/steps",
        element: <StepsPage />,
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
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "/statistics",
            element: <StatisticsPage />,
          },
        ],
      },
    ],
  },
]);
