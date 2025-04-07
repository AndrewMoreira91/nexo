import type { ComponentProps, FC, ReactNode } from 'react'

type ContainerProps = {
	children: ReactNode
	className?: ComponentProps<'div'>['className']
}

const Container: FC<ContainerProps> = ({ children, className }) => {
	return (
		<div className={`flex bg-white px-4 py-6 rounded-2xl shadow ${className}`}>
			{children}
		</div>
	)
}

export default Container
