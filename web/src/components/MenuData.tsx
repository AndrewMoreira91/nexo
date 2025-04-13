import type React from "react";

type MenuDataProps = {
	title: string;
	textMain: string;
	description: string;
	children: React.ReactNode;
};

const MenuData: React.FC<MenuDataProps> = ({
	description,
	children,
	textMain,
	title,
}) => {
	return (
		<div className="flex flex-1 flex-col gap-4 border border-gray-300 py-4 px-6 rounded-2xl max-w-xs">
			<div className="flex flex-row items-center gap-4">
				{children}
				<span className="font-semibold">{title}</span>
			</div>
			<div className="flex flex-col">
				<span className="font-bold text-3xl">{textMain}</span>
				<span className="font-medium text-gray-500">{description}</span>
			</div>
		</div>
	);
};

export default MenuData;
