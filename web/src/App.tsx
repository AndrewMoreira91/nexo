import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/auth.context";
import { PomodoroProvider } from "./context/pomodoro.context";
import queryClient from "./libs/react-query";
import { router } from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PomodoroProvider>
          <RouterProvider router={router} />
        </PomodoroProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
