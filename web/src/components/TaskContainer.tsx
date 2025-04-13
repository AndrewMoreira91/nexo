import { DialogTitle, FormControl, Input, Modal, ModalClose, ModalDialog, Stack } from "@mui/joy"
import { type FC, useState } from "react"
import { FaPlus } from "react-icons/fa"
import type { TaskType } from "../types"
import Button from "./Button"
import TaskItem from "./TaskItem"

type TaskContainerProps = {
	taskList: TaskType[]
}

const TaskContainer: FC<TaskContainerProps> = ({ taskList }) => {

	const [modalOpen, setModalOpen] = useState(false)

	return (
		<>
			<div className="flex flex-row justify-between w-full">
				<h5 className="font-bold text-xl">Tarefas</h5>
				<Button
					onClick={() => setModalOpen(true)}
				>
					<FaPlus className="text-white" />
					Nova Tarefa
				</Button>
			</div>

			<div className="flex flex-col gap-4">
				{taskList.map((task) => (
					<TaskItem
						key={task.id}
						title={task.title}
						description={task.description}
						isCompleted={task.isCompleted}
						tagType={task.inProgress ? "in-progress" : task.isCompleted ? "success" : "pending"}
					/>
				))}
			</div>

			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<ModalDialog>
					<ModalClose />
					<DialogTitle>Crie uma nova tarefa</DialogTitle>
					<form
						onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault();
							setModalOpen(false);
						}}
					>
						<Stack spacing={2}>
							<FormControl>
								<Input autoFocus required placeholder="Digite o  título da nova tarefa" />
							</FormControl>
							<Button type="submit">Criar tarefa</Button>
						</Stack>
					</form>
				</ModalDialog>
			</Modal>
		</>
	)
}

export default TaskContainer