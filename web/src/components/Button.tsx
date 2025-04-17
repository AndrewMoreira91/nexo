import type { ButtonHTMLAttributes } from "react";
import { DotLoader } from "react-spinners";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	onClick?: () => void;
	theme?: "primary" | "secondary" | "outline" | "outline-secondary";
	size?: "small" | "large";
	isLoading?: boolean;
	// className?: ComponentProps<'button'>['className']
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	theme = "primary",
	size = "small",
	isLoading = false,
	className,
	...props
}) => {
	return (
		<button
			onClick={onClick}
			className={`
			${size === "large" ? "text-lg px-6 py-4" : "px-4 py-2"}
			${theme === "primary" && "bg-primary text-white hover:bg-primary-hover"}
			${theme === "outline" && "bg-transparent text-primary border border-primary hover:text-primary-hover hover:border-primary-hover"}
			${theme === "outline-secondary" && "bg-transparent text-gray-500 border border-gray-500 hover:bg-gray-500 hover:text-white"}
			font-bold rounded-2xl cursor-pointer transition  inset-0 flex items-center justify-center
			${className}
			`}
			disabled={isLoading}
			{...props}
		>
			{isLoading && (
				<div className="absolute">
					<DotLoader
						color={theme === "primary" ? "#ffffff" : "#3471ff"}
						size={size === "large" ? 30 : 20}
						aria-label="Loading Spinner"
					/>
				</div>
			)}
			<div className={`${isLoading && "opacity-0"} flex flex-row gap-2 items-center justify-center`}>
				{children}
			</div>
		</button>
	);
};

export default Button;
