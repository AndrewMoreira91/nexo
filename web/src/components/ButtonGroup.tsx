import { type FC, useState } from "react";
import ButtonPill from "./ButtonPill";

type ButtonGroupProps = {
	values: string[];
	keys: string[];
	disableDeselection?: boolean;
	onValueSelect?: (value: string) => void;
};

const ButtonGroup: FC<ButtonGroupProps> = ({
	keys,
	values,
	onValueSelect,
	disableDeselection = false,
}) => {
	const [selected, setLocalSelected] = useState(0);
	return (
		<div className="flex flex-row gap-4">
			{keys?.map((value, index) => (
				<ButtonPill
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					onClick={() => {
						setLocalSelected(index);
						onValueSelect?.(value);
					}}
					theme={selected === index ? "primary" : "secondary"}
					isDisabled={disableDeselection && selected !== index}
				>
					{values[index]}
				</ButtonPill>
			))}
		</div>
	);
};

export default ButtonGroup;
