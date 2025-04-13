import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	isDisabled?: boolean;
	theme?: "primary" | "secondary" | "outline-primary" | "outline-secondary";
};

const ButtonPill: FC<ButtonPillProps> = ({
	children,
	theme = "primary",
	isDisabled = false,
	...props
}) => {
	return (
		<button
			{...props}
			className={`
			font-medium py-2 px-4 rounded-full transition
			${isDisabled ? "bg-gray-200 opacity-50 cursor-not-allowed" : "cursor-pointer"}
			${!isDisabled && theme === "primary" && "bg-primary text-white hover:bg-primary-hover"}
			${!isDisabled && theme === "secondary" && "bg-gray-200 text-gray-600 hover:bg-gray-300"}
			`}
			disabled={isDisabled}
		>
			{children}
		</button>
	);
};

export default ButtonPill;
