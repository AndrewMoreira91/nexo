import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	onClick?: () => void
	theme?: 'primary' | 'secondary' | 'outline' | 'outline-secondary'
	size?: 'small' | 'large'
	// className?: ComponentProps<'button'>['className']
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	theme = 'primary',
	size = 'small',
	className,
	...props
}) => {
	return (
		<button
			onClick={onClick}
			className={`
			${size === 'large' ? 'text-lg px-6 py-4' : 'px-6 py-2'}
			${theme === 'primary' && 'bg-primary text-white hover:bg-primary-hover'}
			${theme === 'outline' && 'bg-transparent text-primary border border-primary hover:text-primary-hover hover:border-primary-hover'}
			${theme === 'outline-secondary' && 'bg-transparent text-gray-500 border border-gray-500 hover:bg-gray-500 hover:text-white'}
			font-bold rounded-2xl cursor-pointer transition flex fle-row gap-2 items-center justify-center
			${className}
			`}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button
