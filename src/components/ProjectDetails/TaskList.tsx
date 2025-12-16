import { FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectTask } from "@/types/project";

interface TaskListProps {
  tasks: ProjectTask[];
  className?: string;
}

/**
 * Lista de tarefas do projeto
 */
const TaskList = ({ tasks, className }: TaskListProps) => {
  return (
    <div className={cn("bg-card rounded-lg shadow-sm overflow-hidden", className)}>
      <div className="p-4 sm:p-6 border-b border-grayscale-20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-grayscale-50" />
          <h3 className="text-label-bold font-inter text-grayscale-80">Tarefas</h3>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ul className="space-y-3">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  task.completed ? "text-status-stable" : "text-grayscale-30"
                )}
              />
              <span
                className={cn(
                  "text-body font-open-sans",
                  task.completed ? "text-grayscale-70 line-through" : "text-grayscale-100"
                )}
              >
                {task.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
