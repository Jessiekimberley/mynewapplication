import { type RouterOutputs } from "~/trpc/shared";

type Todo = RouterOutputs["todo"]["getAll"][0];

interface TodoStatsProps {
    todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
    if (todos.length === 0) return null;

    return (
        <div className="mt-6 text-center text-sm text-gray-400">
            {todos.filter((t) => !t.completed).length} of {todos.length} tasks remaining
        </div>
    );
} 