import { type FC, useState } from 'react'
import ButtonPill from './ButtonPill'

type ButtonGroupProps = {
	values?: string[]
	setSelectedValue?: (value: string) => void
}

const ButtonGroup: FC<ButtonGroupProps> = ({ values, setSelectedValue }) => {
	const [selected, setLocalSelected] = useState(0)
	return (
		<div className="flex flex-row gap-4">
			{values?.map((value, index) => (
				<ButtonPill
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					onClick={() => {
						setLocalSelected(index)
						setSelectedValue?.(value)
					}}
					theme={selected === index ? 'primary' : 'secondary'}
				>
					{value}
				</ButtonPill>
			))}
		</div>
	)
}

export default ButtonGroup
