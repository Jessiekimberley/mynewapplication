"use client";

import { AddTodoForm, EmptyState, TodoControls, TodoItem, TodoStats } from "./todo";
import { useTodoList } from "~/hooks/use-todo-list";

export function TodoList() {
    const {
        filter,
        sortBy,
        sortOrder,
        isAddingTodo,
        todos,
        isLoading,
        setFilter,
        setSortBy,
        setSortOrder,
        handleAddTodo,
        handleCancelAddTodo,
        handleTodoAdded,
    } = useTodoList();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Todo List</h1>
                <p className="text-gray-300">Stay organized and productive</p>
            </div>

            {/* Controls */}
            <TodoControls
                filter={filter}
                setFilter={setFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onAddTodo={handleAddTodo}
                todos={todos}
            />

            {/* Add Todo Form */}
            {isAddingTodo && (
                <AddTodoForm onSuccess={handleTodoAdded} onCancel={handleCancelAddTodo} />
            )}

            {/* Todo List */}
            <div className="space-y-3">
                {todos?.length === 0 ? (
                    <EmptyState />
                ) : (
                    todos?.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} onUpdate={handleTodoAdded} />
                    ))
                )}
            </div>

            {/* Stats */}
            {todos && <TodoStats todos={todos} />}
        </div>
    );
} 