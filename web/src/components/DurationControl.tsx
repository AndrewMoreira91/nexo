import { FC } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { formattedTime } from "../utils/formatted-time";
import ButtonPill from "./ButtonPill";

type DurationControlProps = {
  label: string;
  duration: number;
  onDecrease: () => void;
  onIncrease: () => void;
  align?: "vertical" | "horizontal";
};

export const DurationControl: FC<DurationControlProps> = ({
  label,
  duration,
  onDecrease,
  onIncrease,
  align = "horizontal",
}) => (
  <div
    className={`flex justify-between gap-4 w-full ${
      align === "horizontal" ? "flex-row" : "flex-col"
    }`}
  >
    <span className="font-semibold text-gray-800 text-2xl">{label}</span>
    <div className="flex flex-row gap-4 justify-between">
      <ButtonPill onClick={onDecrease}>
        <FaChevronDown />
      </ButtonPill>
      <span className="bg-gray-100 p-2 rounded-2xl text-primary font-bold text-2xl">
        {formattedTime(duration)}
      </span>
      <ButtonPill onClick={onIncrease}>
        <FaChevronUp />
      </ButtonPill>
    </div>
  </div>
);
