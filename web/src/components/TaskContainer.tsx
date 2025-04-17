import {
	DialogTitle,
	FormControl,
	Input,
	Modal,
	ModalClose,
	ModalDialog,
	Skeleton,
	Stack,
} from "@mui/joy";
import { type FC, type FormEvent, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useFetchTasks, usePostTask } from "../hooks/task-hooks";
import Button from "./Button";
import TaskItem from "./TaskItem";

const TaskContainer: FC = () => {
	const [modalOpen, setModalOpen] = useState(false);

	const fetchTasks = useFetchTasks();
	const postTask = usePostTask();

	const handleNewTask = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setModalOpen(false);

		const taskValue = event.currentTarget.task.value;

		postTask.mutate(taskValue);
	};

	return (
		<>
			<div className="flex flex-row justify-between w-full relative">
				<h5 className="font-bold text-xl">Tarefas</h5>
				<Button
					isLoading={postTask.isPending || fetchTasks.isLoading}
					onClick={() => setModalOpen(true)}
				>
					<FaPlus className="text-white" />
					Nova Tarefa
				</Button>
			</div>
			<Skeleton
				loading={fetchTasks.isLoading}
				animation="wave"
				variant="text"
				sx={{ width: "100%" }}
			/>
			<Skeleton
				loading={fetchTasks.isLoading}
				animation="wave"
				variant="text"
				sx={{ width: "100%" }}
			/>
			<Skeleton
				loading={fetchTasks.isLoading}
				animation="wave"
				variant="text"
				sx={{ width: "100%" }}
			/>

			<div className="flex flex-col gap-4">
				{fetchTasks.data?.length === 0 && (
					<span>{"Você não tem nenhuma task :("}</span>
				)}
				{fetchTasks.data?.map((task) => (
					<TaskItem
						key={task.id}
						id={task.id}
						title={task.title}
						description={task.description}
						isCompleted={task.isCompleted}
						tagType={
							task.inProgress
								? "in-progress"
								: task.isCompleted
									? "success"
									: "pending"
						}
					/>
				))}
			</div>

			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<ModalDialog>
					<ModalClose />
					<DialogTitle>Crie uma nova tarefa</DialogTitle>
					<form onSubmit={handleNewTask}>
						<Stack spacing={2}>
							<FormControl>
								<Input
									autoFocus
									required
									placeholder="Digite o  título da nova tarefa"
									name="task"
									id="task"
								/>
							</FormControl>
							<Button type="submit">Criar tarefa</Button>
						</Stack>
					</form>
				</ModalDialog>
			</Modal>
		</>
	);
};

export default TaskContainer;
