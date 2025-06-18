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
      flex flex-col items-center justify-center shadow rounded-2xl font-semibold py-12 px-6 cursor-pointer
      ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-primary"}
    `}
    onClick={onClick}
  >
    <span>{label}</span>
  </button>
);

export default DaySelectorButton;
