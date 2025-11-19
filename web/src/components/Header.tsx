import { Divider, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { FaClock, FaPause, FaPlay } from "react-icons/fa";
import { IoMdExit, IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import LogoNexoIcon from "../assets/LogoNexoIcon";
import { useAuth } from "../context/auth.context";
import { usePomodoro } from "../context/pomodoro.context";
import formatSecondsToMinutes from "../utils/formatSecondsToMinutes";
import Button from "./Button";
import ProfileAvatar from "./ProfileAvatar";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const {
    currentMode,
    timeLeft,
    isTimerPaused,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetSession,
  } = usePomodoro();

  function handleClickOnLogo() {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }

  function toggleTimer() {
    if (isTimerRunning) {
      stopTimer();
      return;
    }

    startTimer();
  }

  return (
    <div className="relative">
      <header className="flex bg-white items-center justify-between px-6 sm:px-16 py-4 border-b border-gray-200">
        <button
          type="button"
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={handleClickOnLogo}
        >
          <LogoNexoIcon />
          <span className="hidden sm:block font-bold text-3xl text-primary">
            NEXO
          </span>
        </button>

        {isTimerPaused && (
          <Dropdown>
            <MenuButton variant="plain">
              <div
                className={`hidden sm:flex flex-row gap-2 justify-center items-center ${currentMode}`}
              >
                <span className="hidden font-medium text-gray-500 md:block">
                  {currentMode === "focus" ? "Focando" : "Descansando"}
                </span>
                <span className="font-bold text-xl text-primary">
                  {formatSecondsToMinutes(timeLeft)}
                </span>
                <FaClock
                  size={24}
                  className={`text-primary ${
                    isTimerRunning ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </MenuButton>

            <Menu placement="bottom-end">
              <MenuItem>
                <Button onClick={toggleTimer} size="small" className="w-full">
                  {isTimerRunning ? (
                    <FaPause className="text-sm" />
                  ) : (
                    <FaPlay className="text-sm" />
                  )}
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  theme="outline"
                  onClick={() => navigate("/pomodoro")}
                  size="small"
                  className="text-sm"
                >
                  Visualizar
                </Button>
              </MenuItem>
            </Menu>
          </Dropdown>
        )}

        {isAuthenticated && user?.completedOnboarding && (
          <div className="flex flex-row gap-4 items-center font-bold text-primary">
            <button
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              <span>Dashboard</span>
            </button>
            <button
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              type="button"
              onClick={() => navigate("/pomodoro")}
            >
              <span>Pomodoro</span>
            </button>
            <Dropdown defaultOpen={false}>
              <MenuButton variant="plain">
                <ProfileAvatar size="lg" color="primary" />
              </MenuButton>

              <Menu placement="bottom-end">
                <div>
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-3 items-center px-2">
                      <ProfileAvatar
                        size="md"
                        color="primary"
                        variant="outlined"
                      />
                      <h3 className="font-semibold text-2xl">{user?.name}</h3>
                    </div>
                    <Divider sx={{ marginY: 1 }} />
                  </div>

                  <MenuItem>
                    <button
                      type="button"
                      className="p-2 cursor-pointer"
                      onClick={() => {
                        navigate("/settings");
                      }}
                    >
                      <li className="flex flex-row gap-3 items-center">
                        <div className="bg-primary-bg p-2 rounded-full">
                          <IoMdSettings size={20} className="text-primary" />
                        </div>
                        <span className="font-medium text-lg">
                          Perfil e definições
                        </span>
                      </li>
                    </button>
                  </MenuItem>

                  <MenuItem>
                    <button
                      type="button"
                      className="p-2 cursor-pointer"
                      onClick={logout}
                    >
                      <li className="flex flex-row gap-3 items-center">
                        <div className="bg-primary-bg p-2 rounded-full">
                          <IoMdExit size={20} className="text-primary" />
                        </div>
                        <span className="font-medium text-lg">
                          Sair da conta
                        </span>
                      </li>
                    </button>
                  </MenuItem>
                </div>
              </Menu>
            </Dropdown>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
