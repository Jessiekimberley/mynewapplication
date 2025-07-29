"use client";

import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type Todo = RouterOutputs["todo"]["getAll"][0];

interface TodoControlsProps {
    filter: "all" | "active" | "completed";
    setFilter: (filter: "all" | "active" | "completed") => void;
    sortBy: "createdAt" | "dueDate" | "priority";
    setSortBy: (sortBy: "createdAt" | "dueDate" | "priority") => void;
    sortOrder: "asc" | "desc";
    setSortOrder: (sortOrder: "asc" | "desc") => void;
    onAddTodo: () => void;
    todos?: Todo[];
}

export function TodoControls({
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    onAddTodo,
    todos,
}: TodoControlsProps) {
    const utils = api.useUtils();

    const deleteCompleted = api.todo.deleteCompleted.useMutation({
        onSuccess: () => {
            utils.todo.getAll.invalidate();
        },
    });

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Filters */}
                <div className="flex gap-2">
                    {(["all", "active", "completed"] as const).map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === filterOption
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                                }`}
                        >
                            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="flex gap-2 items-center">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="createdAt">Created Date</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onAddTodo}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Add Todo
                    </button>
                    {todos?.some((todo) => todo.completed) && (
                        <button
                            onClick={() => deleteCompleted.mutate()}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Clear Completed
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 