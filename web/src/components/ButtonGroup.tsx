import type { FC } from 'react'
import ButtonPill from './ButtonPill'

type ButtonGroupProps = {
	values: string[]
	keys: string[]
	disableDeselection?: boolean
	onValueSelect?: (value: string) => void
	selectedValue?: string
}

const ButtonGroup: FC<ButtonGroupProps> = ({
	keys,
	values,
	onValueSelect,
	disableDeselection = false,
	selectedValue = values[0],
}) => {
	return (
		<div className="flex flex-row gap-4">
			{keys?.map((key, index) => (
				<ButtonPill
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					onClick={() => {
						onValueSelect?.(key)
					}}
					theme={selectedValue === key ? 'primary' : 'secondary'}
					isDisabled={disableDeselection && selectedValue !== key}
				>
					{values[index]}
				</ButtonPill>
			))}
		</div>
	)
}

export default ButtonGroup
