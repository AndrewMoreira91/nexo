import type React from "react";
import type { InputHTMLAttributes } from "react";

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
	...props
}) => {
	return (
		<>
			<input
				{...props}
				className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
			/>
		</>
	);
};

export default Input;
