import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'

type ButtonPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode
	theme?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary'
}

const ButtonPill: FC<ButtonPillProps> = ({ children, theme = 'primary', ...props }) => {
	return (
		<button
			{...props}
			className={`
			${theme === 'primary' && 'bg-primary text-white hover:bg-primary-hover'}
			${theme === 'secondary' && 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
			font-medium py-2 px-4 rounded-full cursor-pointer transition
			`}
		>
			{children}
		</button>
	)
}

export default ButtonPill
