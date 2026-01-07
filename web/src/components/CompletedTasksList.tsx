import { Skeleton } from "@mui/joy";
import { useState } from "react";
import { FaCalendarAlt, FaCheck, FaChevronDown } from "react-icons/fa";
import type { TaskType } from "../types";
import Container from "./Container";

interface CompletedTasksListProps {
  tasks: TaskType[] | undefined;
  isLoading: boolean;
}

const CompletedTasksList = ({
  tasks = [],
  isLoading,
}: CompletedTasksListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedTasks = (tasks || [])
    .filter((task) => task.isCompleted)
    .sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
    );

  const completedCount = sortedTasks.length;
  const totalCount = (tasks || []).length;

  const formatTaskDate = (date: Date | string | null | undefined): string => {
    if (!date) return "Data inválida";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return "Data inválida";
      }
      return dateObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Data inválida";
    }
  };

  if (isLoading) {
    return (
      <Container className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-4">
          <FaCheck className="text-green-500 text-2xl" />
          <h3 className="font-bold text-xl">Tarefas Completadas</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="text" level="body-xs" />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <FaCheck className="text-green-500 text-2xl" />
          <h3 className="font-bold text-xl">Tarefas Completadas</h3>
        </div>
        <span className="text-sm font-semibold text-gray-500">
          {completedCount} de {totalCount}
        </span>
      </div>

      {/* Botão para expandir/recolher */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
        type="button"
      >
        <span className="font-semibold text-gray-700">
          {completedCount === 0
            ? "Nenhuma tarefa completada"
            : `Ver ${completedCount} tarefa${completedCount !== 1 ? "s" : ""}`}
        </span>
        <FaChevronDown
          className={`text-gray-600 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Lista de tarefas com animação de slide */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {completedCount === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-gray-400">
            <FaCalendarAlt className="text-4xl opacity-50" />
            <p className="font-medium">Nenhuma tarefa completada ainda</p>
            <p className="text-sm">Complete algumas tarefas para vê-las aqui</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-center w-6 h-6 mt-0.5 rounded-full bg-green-500 flex-shrink-0">
                  <FaCheck className="text-white text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <FaCalendarAlt className="text-xs text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {formatTaskDate(task.updated_at || task.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Taxa de conclusão - aparece apenas quando expandido e há tarefas */}
        {completedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Taxa de conclusão:</span>
              <span className="font-semibold text-primary">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CompletedTasksList;
