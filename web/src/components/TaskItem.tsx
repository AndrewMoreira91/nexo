import CheckBox from "./CheckBox";
import Tag from "./Tag";

type TaskItemProps = {
	title: string;
	tagType?: "pending" | "in-progress" | "success";
	description?: string;
	isCompleted?: boolean;
};

const TaskItem: React.FC<TaskItemProps> = ({
	title,
	description,
	isCompleted,
	tagType = "success",
}) => {
	return (
		<div
			className={`
		flex flex-row items-center justify-between px-4 py-6 w-full rounded-l-lg border border-gray-200
		${isCompleted ? "bg-primary-success-bg" : "bg-white"}
		`}
		>
			<div className="flex flex-row gap-3">
				{!isCompleted && <CheckBox />}
				<div>
					<h2 className="font-medium text-lg">{title}</h2>
					<p className="text-base">{description}</p>
				</div>
			</div>

			<Tag type={isCompleted ? "success" : tagType} />
		</div>
	);
};

export default TaskItem;
