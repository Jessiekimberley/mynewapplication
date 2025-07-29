import { useState } from "react";
import { api } from "~/trpc/react";

export function useTodoList() {
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
    const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isAddingTodo, setIsAddingTodo] = useState(false);

    const { data: todos, isLoading } = api.todo.getAll.useQuery({
        filter,
        sortBy,
        sortOrder,
    });

    const handleAddTodo = () => {
        setIsAddingTodo(true);
    };

    const handleCancelAddTodo = () => {
        setIsAddingTodo(false);
    };

    const handleTodoAdded = () => {
        setIsAddingTodo(false);
    };

    return {
        // State
        filter,
        sortBy,
        sortOrder,
        isAddingTodo,
        todos,
        isLoading,

        // Actions
        setFilter,
        setSortBy,
        setSortOrder,
        handleAddTodo,
        handleCancelAddTodo,
        handleTodoAdded,
    };
} 