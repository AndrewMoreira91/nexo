import { useNavigate } from "react-router";
import AvatarIcon from "../assets/AvatarIcon";
import LogoNexoIcon from "../assets/LogoNexoIcon";
import { useAuth } from "../context/auth.context";

const Header = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

	function handleClickOnLogo() {
		if (isAuthenticated) {
			navigate("/dashboard");
		} else {
			navigate("/");
		}
	}

	return (
		<header className="flex bg-white items-center justify-between px-7 sm:px-16 py-4 border-b border-gray-200">
			<button
				type="button"
				className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
				onClick={handleClickOnLogo}
			>
				<LogoNexoIcon />
				<span className="font-bold text-3xl text-primary">NEXO</span>
			</button>
			<AvatarIcon color="#3471FF" />
		</header>
	);
};

export default Header;
