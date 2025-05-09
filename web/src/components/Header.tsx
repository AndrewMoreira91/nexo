import { Avatar, Dropdown } from "@mui/joy";
import { useRef } from "react";
import { IoMdExit, IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import LogoNexoIcon from "../assets/LogoNexoIcon";
import { useAuth } from "../context/auth.context";

const Header = () => {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout } = useAuth();

	const avatarRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

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
				<button
					type="button"
					onClick={() => dropdownRef.current?.classList.toggle("hidden")}
					ref={avatarRef}
					className="cursor-pointer"
				>
					<Dropdown>
						<Avatar src="" size="lg" color="primary" alt={user?.name} />
					</Dropdown>
				</button>
			</header>
			{isAuthenticated && (
				<div
					ref={dropdownRef}
					className="hidden flex-col gap-6 bg-white shadow-2xl p-6 rounded-2xl absolute left-0 sm:left-auto right-0 mx-6 sm:mx-16 top-[60px]"
				>
					<div className="flex flex-col">
						<div className="flex flex-row gap-3">
							<Avatar
								src=""
								size="md"
								color="primary"
								variant="outlined"
								alt={user?.name}
							/>
							<h3 className="font-semibold text-2xl">{user?.name}</h3>
						</div>
						<div className="w-full h-[1px] bg-gray-300 mt-2" />
					</div>

					<ul className="flex flex-col gap-6">
						<button
							type="button"
							className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-2xl"
						>
							<li className="flex flex-row gap-3 items-center">
								<div className="bg-primary-bg p-2 rounded-full">
									<IoMdSettings size={25} className="text-primary" />
								</div>
								<span className="font-medium text-xl">Perfil e definições</span>
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
		</div>
	);
};

export default Header;
