import { FC } from "react";

type DaySelectorButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

const DaySelectorButton: FC<DaySelectorButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => (
  <button
    type="button"
    className={`
      flex flex-col items-center justify-center shadow font-semibold
      rounded-xl
      py-4 px-1 sm:px-2 sm:py-6 md:px-4 md:py-8 lg:px-6 lg:py-10
      cursor-pointer
      ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-primary"}
    `}
    onClick={onClick}
  >
    <span>{label}</span>
  </button>
);

export default DaySelectorButton;
