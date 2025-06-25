import { useState } from "react";
import { IoMdExit, IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import LogoNexoIcon from "../assets/LogoNexoIcon";
import { useAuth } from "../context/auth.context";
import ProfileAvatar from "./ProfileAvatar";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleClickOnLogo() {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="relative">
      <header className="flex bg-white items-center justify-between px-7 sm:px-16 py-4 border-b border-gray-200">
        <button
          type="button"
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={handleClickOnLogo}
        >
          <LogoNexoIcon />
          <span className="font-bold text-3xl text-primary">NEXO</span>
        </button>
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
            <button
              type="button"
              className="cursor-pointer"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <ProfileAvatar size="lg" color="primary" />
            </button>
          </div>
        )}
        {isAuthenticated && (
          <div
            className={`
            ${
              dropdownOpen ? "flex" : "hidden"
            } flex-col gap-6 bg-white shadow-2xl p-6 rounded-2xl absolute left-0 sm:left-auto right-0 mx-6 sm:mx-16 top-[60px]
            `}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="flex flex-col">
              <div className="flex flex-row gap-3">
                <ProfileAvatar size="md" color="primary" variant="outlined" />
                <h3 className="font-semibold text-2xl">{user?.name}</h3>
              </div>
              <div className="w-full h-[1px] bg-gray-300 mt-2" />
            </div>

            <ul className="flex flex-col gap-6">
              <button
                type="button"
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-2xl"
                onClick={() => navigate("/settings")}
              >
                <li className="flex flex-row gap-3 items-center">
                  <div className="bg-primary-bg p-2 rounded-full">
                    <IoMdSettings size={25} className="text-primary" />
                  </div>
                  <span className="font-medium text-xl">
                    Perfil e definições
                  </span>
                </li>
              </button>
              <button
                type="button"
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-2xl"
                onClick={logout}
              >
                <li className="flex flex-row gap-3 items-center">
                  <div className="bg-primary-bg p-2 rounded-full">
                    <IoMdExit size={25} className="text-primary" />
                  </div>
                  <span className="font-medium text-xl">Sair da conta</span>
                </li>
              </button>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
