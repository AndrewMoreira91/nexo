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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, type FormEvent, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { api } from "../libs/api";
import type { TaskType } from "../types";
import Button from "./Button";
import TaskItem from "./TaskItem";

const TaskContainer: FC = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [taskTitle, setTaskTitle] = useState("");

	const queryClient = useQueryClient();

	const handleNewTask = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setModalOpen(false);

		const task = event.currentTarget.task.value;
		setTaskTitle(task);

		mutate(task);
	};

	const fetchTasks = async () => {
		const response = await api.get<TaskType[]>("/task");
		return response.data;
	};

	const postTask = async () => {
		const response = await api.post<TaskType>("/task", {
			title: taskTitle,
		});
		return response.data;
	};

	const { data: taskList, isLoading: isTaksLoading } = useQuery({
		queryKey: ["tasks"],
		queryFn: fetchTasks,
		refetchOnWindowFocus: true,
	});

	const { mutate } = useMutation({
		mutationFn: postTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	return (
		<>
			<div className="flex flex-row justify-between w-full relative">
				<h5 className="font-bold text-xl">Tarefas</h5>
				<Button onClick={() => setModalOpen(true)}>
					<FaPlus className="text-white" />
					Nova Tarefa
				</Button>
			</div>
			<Skeleton
				loading={isTaksLoading}
				animation="wave"
				variant="text"
				sx={{ width: "100%" }}
			/>
			<Skeleton
				loading={isTaksLoading}
				animation="wave"
				variant="text"
				sx={{ width: "100%" }}
			/>
			<Skeleton
				loading={isTaksLoading}
				animation="wave"
				variant="text"
				sx={{ width: "100%" }}
			/>

			<div className="flex flex-col gap-4">
				{taskList?.map((task) => (
					<TaskItem
						key={task.id}
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
