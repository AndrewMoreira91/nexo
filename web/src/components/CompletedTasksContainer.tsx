import { Divider, Skeleton } from "@mui/joy";
import { type FC, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useFetchCompletedTasks } from "../hooks/task-hooks";
import TaskItem from "./TaskItem";

type CompletedTasksContainerProps = {
  onTaskSelected?: (taskId: string) => void;
  withCheckbox?: boolean;
};

const CompletedTasksContainer: FC<CompletedTasksContainerProps> = ({
  onTaskSelected,
  withCheckbox,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const completedTasks = useFetchCompletedTasks();

  const displayedTasks = completedTasks.data?.slice(0, 6) || [];
  const totalCompleted = completedTasks.data?.length || 0;
  const hasMore = totalCompleted > 6;

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
					w-full flex flex-row items-center justify-between px-4 rounded-lg hover:bg-gray-100
					transition-colors cursor-pointer
				"
      >
        <div className="flex flex-row items-center gap-2">
          <span className="font-semibold text-sm">
            Tarefas Completadas ({totalCompleted})
          </span>
          {hasMore && (
            <span className="text-sm text-gray-500">
              Mostrando 6 de {totalCompleted}
            </span>
          )}
        </div>
        {isOpen ? (
          <FaChevronUp className="text-primary" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          {completedTasks.isLoading && (
            <div className="flex flex-col gap-4">
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ width: "100%" }}
              />
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ width: "100%" }}
              />
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ width: "100%" }}
              />
            </div>
          )}

          {completedTasks.isError && (
            <div className="flex flex-row items-center gap-2 text-primary-danger">
              <span className="font-semibold">
                Erro ao carregar tarefas completadas
              </span>
              <MdError size={20} />
            </div>
          )}

          {!completedTasks.isLoading &&
            !completedTasks.isError &&
            displayedTasks.length === 0 && (
              <span className="text-gray-500">
                Nenhuma tarefa completada ainda
              </span>
            )}

          <div className="flex flex-col gap-3">
            {displayedTasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                isCompleted={task.isCompleted}
                onSelect={() => onTaskSelected?.(task.id)}
                withCheckbox={withCheckbox}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/statistics"
                className="text-primary font-semibold hover:text-primary-hover"
              >
                Ver todas as tarefas completadas →
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CompletedTasksContainer;
