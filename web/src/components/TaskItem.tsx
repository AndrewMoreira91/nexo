import {
  Button,
  Checkbox,
  DialogTitle,
  Dropdown,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Modal,
  ModalClose,
  ModalDialog,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/joy";
import { type FormEvent, useState } from "react";
import { FaCheck, FaEdit, FaRegTrashAlt } from "react-icons/fa";
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

  const handleCompleteTask = () => {
    updateTask.mutate({
      taskId: id,
      newTitle: title,
      isCompleted: true,
    });
  };
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
          {/* Mobile: Show dropdown button */}
          {!isCompleted && (
            <Dropdown>
              <MenuButton
                slots={{ root: "button" }}
                slotProps={{
                  root: {
                    className:
                      "block sm:hidden active:bg-primary-bg rounded-full p-1",
                  },
                }}
                variant="plain"
                color="neutral"
              >
                <IoMdMore size={25} />
              </MenuButton>
              <Menu
                placement="bottom-end"
                sx={{
                  borderRadius: "12px",
                  paddingY: "8px",
                  paddingX: "0px",
                }}
              >
                <MenuItem>
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
                </MenuItem>
                <MenuItem>
                  <Tooltip title="Deletar tarefa">
                    <ButtonPill
                      size="small"
                      theme="danger"
                      onClick={handleDeleteTask}
                    >
                      <FaRegTrashAlt
                        className="text-primary-danger"
                        size={20}
                      />
                      <span className="block sm:hidden">Remover</span>
                    </ButtonPill>
                  </Tooltip>
                </MenuItem>
                <MenuItem>
                  <Tooltip title="Marcar como concluída">
                    <ButtonPill
                      size="small"
                      theme="success"
                      onClick={handleCompleteTask}
                    >
                      <FaCheck className="text-primary-success" size={20} />
                      <span className="block sm:hidden">Concluir</span>
                    </ButtonPill>
                  </Tooltip>
                </MenuItem>
              </Menu>
            </Dropdown>
          )}

          {!isCompleted && (
            <div className="hidden sm:flex flex-row gap-2">
              <Tooltip title="Editar tarefa">
                <ButtonPill
                  size="small"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  <FaEdit className="text-white" size={20} />
                </ButtonPill>
              </Tooltip>
              <Tooltip title="Deletar tarefa">
                <ButtonPill
                  size="small"
                  theme="danger"
                  onClick={handleDeleteTask}
                >
                  <FaRegTrashAlt className="text-primary-danger" size={20} />
                </ButtonPill>
              </Tooltip>
              <Tooltip title="Marcar como concluída">
                <ButtonPill
                  size="small"
                  theme="success"
                  onClick={handleCompleteTask}
                >
                  <FaCheck className="text-primary-success" size={20} />
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
