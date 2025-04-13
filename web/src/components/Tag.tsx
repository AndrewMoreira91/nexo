type TagProps = {
	type: "pending" | "in-progress" | "success";
};

const Tag: React.FC<TagProps> = ({ type }) => {
	return (
		<div
			className={`
			${type === "in-progress" && "bg-primary-bg text-primary"}
			${type === "pending" && "bg-gray-100 text-gray-600"}
			${type === "success" && "bg-primary-success-bg text-primary-success"}
			flex px-3 py-1 items-center justify-center rounded-full 
			`}
		>
			<span className="font-medium inline">
				{type === "in-progress"
					? "Em progresso"
					: type === "pending"
						? "Pendente"
						: type === "success"
							? "Concluído"
							: ""}
			</span>
		</div>
	);
};

export default Tag;
