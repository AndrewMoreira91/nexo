import AvatarIcon from "../assets/AvatarIcon";
import LogoNexoIcon from "../assets/LogoNexoIcon";

const Header = () => {
	return (
		<header className="flex items-center justify-between px-7 sm:px-16 py-4 border-b border-gray-200">
			<div className="flex items-center">
				<LogoNexoIcon />
				<span className="font-bold text-3xl text-primary">NEXO</span>
			</div>
			<AvatarIcon color="#3471FF" />
		</header>
	);
};

export default Header;
