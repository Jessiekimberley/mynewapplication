"use client";

import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type Todo = RouterOutputs["todo"]["getAll"][0];

interface TodoItemProps {
    todo: Todo;
    onUpdate: () => void;
}

export function TodoItem({ todo, onUpdate }: TodoItemProps) {
    const utils = api.useUtils();

    const toggleComplete = api.todo.toggleComplete.useMutation({
        onSuccess: () => {
            utils.todo.getAll.invalidate();
            onUpdate();
        },
    });

    const deleteTodo = api.todo.delete.useMutation({
        onSuccess: () => {
            utils.todo.getAll.invalidate();
            onUpdate();
        },
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-500 bg-red-100 dark:bg-red-900/20";
            case "medium":
                return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
            case "low":
                return "text-green-500 bg-green-100 dark:bg-green-900/20";
            default:
                return "text-gray-500 bg-gray-100 dark:bg-gray-900/20";
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <div
            className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all hover:bg-white/15 ${todo.completed ? "opacity-75" : ""
                }`}
        >
            <div className="flex items-start gap-3">
                <button
                    onClick={() => toggleComplete.mutate({ id: todo.id })}
                    disabled={toggleComplete.isLoading}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-colors ${todo.completed
                            ? "bg-green-500 border-green-500"
                            : "border-white/30 hover:border-white/50"
                        }`}
                >
                    {todo.completed && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`font-medium text-white truncate ${todo.completed ? "line-through text-gray-400" : ""
                                    }`}
                            >
                                {todo.title}
                            </h3>
                            {todo.description && (
                                <p
                                    className={`text-sm text-gray-300 mt-1 ${todo.completed ? "line-through" : ""
                                        }`}
                                >
                                    {todo.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                                    todo.priority,
                                )}`}
                            >
                                {todo.priority}
                            </span>
                            {todo.dueDate && (
                                <span className="text-xs text-gray-400">
                                    Due: {formatDate(todo.dueDate)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                            Created: {formatDate(todo.createdAt)}
                        </span>
                        <button
                            onClick={() => deleteTodo.mutate({ id: todo.id })}
                            disabled={deleteTodo.isLoading}
                            className="text-red-400 hover:text-red-300 transition-colors text-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 