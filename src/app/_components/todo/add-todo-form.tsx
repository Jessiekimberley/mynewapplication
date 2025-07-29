"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface AddTodoFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function AddTodoForm({ onSuccess, onCancel }: AddTodoFormProps) {
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [newTodoDescription, setNewTodoDescription] = useState("");
    const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium");
    const [newTodoDueDate, setNewTodoDueDate] = useState("");

    const utils = api.useUtils();

    const createTodo = api.todo.create.useMutation({
        onSuccess: () => {
            utils.todo.getAll.invalidate();
            setNewTodoTitle("");
            setNewTodoDescription("");
            setNewTodoPriority("medium");
            setNewTodoDueDate("");
            onSuccess();
        },
    });

    const handleCreateTodo = () => {
        if (!newTodoTitle.trim()) return;

        createTodo.mutate({
            title: newTodoTitle.trim(),
            description: newTodoDescription.trim() || undefined,
            priority: newTodoPriority,
            dueDate: newTodoDueDate ? new Date(newTodoDueDate) : undefined,
        });
    };

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Todo</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What needs to be done?"
                        onKeyPress={(e) => e.key === "Enter" && handleCreateTodo()}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={newTodoDescription}
                        onChange={(e) => setNewTodoDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add more details..."
                        rows={3}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Priority
                        </label>
                        <select
                            value={newTodoPriority}
                            onChange={(e) => setNewTodoPriority(e.target.value as any)}
                            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={newTodoDueDate}
                            onChange={(e) => setNewTodoDueDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateTodo}
                        disabled={!newTodoTitle.trim() || createTodo.isLoading}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createTodo.isLoading ? "Adding..." : "Add Todo"}
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
} 