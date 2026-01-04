import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isDisabled?: boolean;
  theme?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  className?: string;
};

const ButtonPill: FC<ButtonPillProps> = ({
  children,
  theme = "primary",
  isDisabled = false,
  size = "medium",
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`
			font-medium rounded-full transition flex items-center justify-center gap-1
			${size === "small" && "px-2 py-1 text-sm"}
			${size === "medium" && "p-2 sm:p-3 text-base"}
			${size === "large" && "p-3 sm:p-4 text-lg"}
			${isDisabled ? "bg-gray-200 opacity-50 cursor-not-allowed" : "cursor-pointer"}
			${
        !isDisabled &&
        theme === "primary" &&
        "bg-primary text-white hover:bg-primary-hover"
      }
			${
        !isDisabled &&
        theme === "secondary" &&
        "bg-gray-200 text-gray-600 hover:bg-gray-300"
      }
      ${
        !isDisabled &&
        theme === "danger" &&
        "bg-primary-danger-bg text-primary-danger hover:opacity-80"
      }
      ${
        !isDisabled &&
        theme === "success" &&
        "bg-primary-success-bg text-primary-success hover:opacity-80"
      }
      ${className}
			`}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default ButtonPill;
