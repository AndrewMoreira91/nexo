import {
	Button,
	Checkbox,
	DialogTitle,
	FormControl,
	Input,
	Modal,
	ModalClose,
	ModalDialog,
	Skeleton,
	Stack,
	Tooltip,
} from "@mui/joy";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { useDeleteTask, useUpdateTask } from "../hooks/task-hooks";
import ButtonPill from "./ButtonPill";
import Tag from "./Tag";

type TaskItemProps = {
	id: string;
	title: string;
	description?: string;
	isCompleted?: boolean;
	onEdit?: (newTitle: string) => void;
	onDelete?: () => void;
	onSelect?: () => void;
	withCheckbox?: boolean;
};

const TaskItem: React.FC<TaskItemProps> = ({
	id,
	title,
	description,
	isCompleted,
	onDelete,
	onEdit,
	onSelect,
	withCheckbox = true,
}) => {
	const [modalOpen, setModalOpen] = useState(false);

	const [titleValue, setTitleValue] = useState(title);

	const [isSelected, setIsSelected] = useState(false);

	const handleSelect = () => {
		setIsSelected((prev) => !prev);
		onSelect?.();
	};

	const deleteTask = useDeleteTask();
	const updateTask = useUpdateTask();

	const handleDeleteTask = () => {
		deleteTask.mutate(id);
		onDelete?.();
	};

	const handleEditTask = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const value = event.currentTarget.task.value;

		updateTask.mutate({
			taskId: id,
			newTitle: value,
			isCompleted,
		});

		onEdit?.(value);

		setModalOpen(false);
	};

	const dropDownMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (
				dropDownMenuRef.current &&
				!dropDownMenuRef.current.contains(event.target as Node)
			) {
				dropDownMenuRef.current.classList.add("hidden");
			}
		};

		document.addEventListener("touchmove", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		return () => {
			document.removeEventListener("touchmove", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, []);
	return (
		<>
			<div
				className={`
				flex flex-row gap- items-center justify-between px-4 py-6 w-full rounded-l-lg border 
				${isSelected && !isCompleted ? "border-primary" : "border-gray-200"}
				${isCompleted ? "bg-primary-success-bg" : "bg-white"}
		`}
			>
				<div className="flex flex-row gap-3 items-center">
					{!isCompleted && withCheckbox && <Checkbox onChange={handleSelect} />}
					<div>
						<Skeleton
							loading={updateTask.isPending}
							animation="wave"
							variant="text"
							sx={{ width: "100%" }}
						>
							<h2 className="font-medium text-lg leading-5">{title}</h2>
						</Skeleton>
						<Skeleton
							loading={updateTask.isPending}
							animation="wave"
							variant="text"
							sx={{ width: "100%" }}
						>
							<p className="text-base">{description}</p>
						</Skeleton>
					</div>
				</div>

				<div className="flex flex-row gap-2 items-center">
					<Tag
						type={
							isCompleted ? "success" : isSelected ? "in-progress" : "pending"
						}
					/>
					<button
						type="button"
						className="block sm:hidden active:bg-primary-bg rounded-full p-1"
						onClick={(e) => {
							e.stopPropagation();
							if (dropDownMenuRef.current) {
								dropDownMenuRef.current.classList.toggle("hidden");
							}
						}}
					>
						<IoMdMore size={25} />
					</button>

					{!isCompleted && (
						<div
							ref={dropDownMenuRef}
							className="
					right-15 top-3/5  rounded-2xl
					hidden sm:flex
					flex-col sm:flex-row gap-2 absolute sm:static bg-primary-bg sm:bg-transparent p-4 sm:p-0 
					"
						>
							<Tooltip title="Editar tarefa">
								<ButtonPill
									size="small"
									onClick={() => {
										setModalOpen(true);
									}}
								>
									<FaEdit className="text-white" size={20} />
									<span className="block sm:hidden">Editar</span>
								</ButtonPill>
							</Tooltip>
							<Tooltip title="Deletar tarefa">
								<ButtonPill
									size="small"
									theme="danger"
									onClick={handleDeleteTask}
								>
									<FaRegTrashAlt className="text-primary-danger" size={20} />
									<span className="block sm:hidden">Remover</span>
								</ButtonPill>
							</Tooltip>
						</div>
					)}
				</div>
			</div>
			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<ModalDialog>
					<ModalClose />
					<DialogTitle>Edite a tarefa</DialogTitle>
					<form onSubmit={handleEditTask}>
						<Stack spacing={2}>
							<FormControl>
								<Input
									autoFocus
									required
									placeholder="Digite o novo título da tarefa"
									name="task"
									id="task"
									value={titleValue}
									onChange={(e) => setTitleValue(e.target.value)}
								/>
							</FormControl>
							<Button type="submit">Editar tarefa</Button>
						</Stack>
					</form>
				</ModalDialog>
			</Modal>
		</>
	);
};

export default TaskItem;
