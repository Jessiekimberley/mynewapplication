import { z } from "zod";
import { eq, desc, asc } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

export const todoRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(
            z.object({
                filter: z.enum(["all", "active", "completed"]).default("all"),
                sortBy: z.enum(["createdAt", "dueDate", "priority"]).default("createdAt"),
                sortOrder: z.enum(["asc", "desc"]).default("desc"),
            }).optional(),
        )
        .query(async ({ ctx, input }) => {
            const { filter = "all", sortBy = "createdAt", sortOrder = "desc" } = input ?? {};

            let query = ctx.db.select().from(todos);

            // Apply filter
            if (filter === "active") {
                query = query.where(eq(todos.completed, false));
            } else if (filter === "completed") {
                query = query.where(eq(todos.completed, true));
            }

            // Apply sorting
            const sortColumn = todos[sortBy as keyof typeof todos];
            if (sortColumn) {
                query = query.orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn));
            }

            return await query;
        }),

    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const result = await ctx.db
                .select()
                .from(todos)
                .where(eq(todos.id, input.id))
                .limit(1);

            return result[0] ?? null;
        }),

    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1, "Title is required"),
                description: z.string().optional(),
                priority: z.enum(["low", "medium", "high"]).default("medium"),
                dueDate: z.date().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db.insert(todos).values({
                title: input.title,
                description: input.description,
                priority: input.priority,
                dueDate: input.dueDate,
            });

            return result;
        }),

    update: publicProcedure
        .input(
            z.object({
                id: z.number(),
                title: z.string().min(1).optional(),
                description: z.string().optional(),
                completed: z.boolean().optional(),
                priority: z.enum(["low", "medium", "high"]).optional(),
                dueDate: z.date().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...updateData } = input;

            await ctx.db
                .update(todos)
                .set(updateData)
                .where(eq(todos.id, id));

            return { success: true };
        }),

    toggleComplete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const todo = await ctx.db
                .select()
                .from(todos)
                .where(eq(todos.id, input.id))
                .limit(1);

            if (!todo[0]) {
                throw new Error("Todo not found");
            }

            await ctx.db
                .update(todos)
                .set({ completed: !todo[0].completed })
                .where(eq(todos.id, input.id));

            return { success: true };
        }),

    delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(todos).where(eq(todos.id, input.id));
            return { success: true };
        }),

    deleteCompleted: publicProcedure.mutation(async ({ ctx }) => {
        await ctx.db.delete(todos).where(eq(todos.completed, true));
        return { success: true };
    }),
}); 