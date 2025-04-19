import { Skeleton } from "@mui/joy";

type MenuInfoProps = {
	title: string;
	description: string;
	children?: React.ReactNode;
	isLoading?: boolean;
};

const MenuInfo: React.FC<MenuInfoProps> = ({
	title,
	description,
	children,
	isLoading = false,
}) => {
	return (
		<Skeleton loading={isLoading} variant="rectangular">
			<div className="flex flex-col flex-1 gap-2 items-center bg-background p-6 rounded-2xl">
				<div className="p-5 bg-primary-bg rounded-full">{children}</div>
				<h4 className="font-semibold text-xl text-center">{title}</h4>
				<p className="font-medium text-gray-400 text-base/5 text-center">
					{description}
				</p>
			</div>
		</Skeleton>
	);
};

export default MenuInfo;
