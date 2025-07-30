import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { workoutDays, workoutSessions, exerciseSets, exercises, workoutPrograms } from "~/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const workoutRouter = createTRPCRouter({
    getPrograms: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.select().from(workoutPrograms);
    }),

    getWorkoutDays: publicProcedure
        .input(z.object({ programId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select()
                .from(workoutDays)
                .where(eq(workoutDays.programId, input.programId))
                .orderBy(workoutDays.order);
        }),

    getOrCreateSession: publicProcedure
        .input(z.object({ workoutDayId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            // Check if there's an existing in-progress session
            const existingSession = await ctx.db
                .select()
                .from(workoutSessions)
                .where(
                    and(
                        eq(workoutSessions.workoutDayId, input.workoutDayId),
                        eq(workoutSessions.status, "in_progress")
                    )
                )
                .limit(1);

            if (existingSession.length > 0) {
                return existingSession[0];
            }

            // Create new session
            await ctx.db
                .insert(workoutSessions)
                .values({
                    workoutDayId: input.workoutDayId,
                    status: "in_progress",
                    startedAt: new Date(),
                });

            // Get the created session
            const newSession = await ctx.db
                .select()
                .from(workoutSessions)
                .where(
                    and(
                        eq(workoutSessions.workoutDayId, input.workoutDayId),
                        eq(workoutSessions.status, "in_progress")
                    )
                )
                .limit(1);

            return newSession[0];
        }),

    getSession: publicProcedure
        .input(z.object({ sessionId: z.number() }))
        .query(async ({ ctx, input }) => {
            const session = await ctx.db
                .select()
                .from(workoutSessions)
                .where(eq(workoutSessions.id, input.sessionId))
                .limit(1);

            return session[0];
        }),

    getSessionExercises: publicProcedure
        .input(z.object({ sessionId: z.number() }))
        .query(async ({ ctx, input }) => {
            const session = await ctx.db
                .select()
                .from(workoutSessions)
                .where(eq(workoutSessions.id, input.sessionId))
                .limit(1);

            if (!session[0]) return [];

            return await ctx.db
                .select()
                .from(exercises)
                .where(eq(exercises.workoutDayId, session[0].workoutDayId))
                .orderBy(exercises.order);
        }),

    getSessionSets: publicProcedure
        .input(z.object({ sessionId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select()
                .from(exerciseSets)
                .where(eq(exerciseSets.sessionId, input.sessionId))
                .orderBy(exerciseSets.setNumber);
        }),

    completeSet: publicProcedure
        .input(
            z.object({
                sessionId: z.number(),
                exerciseId: z.number(),
                setNumber: z.number(),
                weight: z.number().optional(),
                reps: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Check if set already exists
            const existingSet = await ctx.db
                .select()
                .from(exerciseSets)
                .where(
                    and(
                        eq(exerciseSets.sessionId, input.sessionId),
                        eq(exerciseSets.exerciseId, input.exerciseId),
                        eq(exerciseSets.setNumber, input.setNumber)
                    )
                )
                .limit(1);

            if (existingSet.length > 0) {
                // Update existing set
                await ctx.db
                    .update(exerciseSets)
                    .set({
                        weight: input.weight ? input.weight.toString() : null,
                        reps: input.reps,
                        completed: true,
                        completedAt: new Date(),
                    })
                    .where(eq(exerciseSets.id, existingSet[0].id));

                // Get the updated set
                const updatedSet = await ctx.db
                    .select()
                    .from(exerciseSets)
                    .where(eq(exerciseSets.id, existingSet[0].id))
                    .limit(1);

                return updatedSet[0];
            } else {
                // Create new set
                await ctx.db
                    .insert(exerciseSets)
                    .values({
                        sessionId: input.sessionId,
                        exerciseId: input.exerciseId,
                        setNumber: input.setNumber,
                        weight: input.weight ? input.weight.toString() : null,
                        reps: input.reps,
                        completed: true,
                        completedAt: new Date(),
                    });

                // Get the created set
                const newSet = await ctx.db
                    .select()
                    .from(exerciseSets)
                    .where(
                        and(
                            eq(exerciseSets.sessionId, input.sessionId),
                            eq(exerciseSets.exerciseId, input.exerciseId),
                            eq(exerciseSets.setNumber, input.setNumber)
                        )
                    )
                    .limit(1);

                return newSet[0];
            }
        }),

    updateSession: publicProcedure
        .input(
            z.object({
                sessionId: z.number(),
                status: z.enum(["not_started", "in_progress", "completed"]),
                startedAt: z.date().optional(),
                completedAt: z.date().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(workoutSessions)
                .set({
                    status: input.status,
                    ...(input.startedAt && { startedAt: input.startedAt }),
                    ...(input.completedAt && { completedAt: input.completedAt }),
                })
                .where(eq(workoutSessions.id, input.sessionId));

            // Get the updated session
            const updatedSession = await ctx.db
                .select()
                .from(workoutSessions)
                .where(eq(workoutSessions.id, input.sessionId))
                .limit(1);

            return updatedSession[0];
        }),

    getWorkoutHistory: publicProcedure
        .input(z.object({ workoutDayId: z.number() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db
                .select()
                .from(workoutSessions)
                .where(eq(workoutSessions.workoutDayId, input.workoutDayId))
                .orderBy(desc(workoutSessions.completedAt));
        }),

    getLastCompletedSession: publicProcedure
        .input(z.object({ exerciseId: z.number() }))
        .query(async ({ ctx, input }) => {
            const sessions = await ctx.db
                .select({
                    weight: exerciseSets.weight,
                    reps: exerciseSets.reps,
                })
                .from(exerciseSets)
                .innerJoin(workoutSessions, eq(exerciseSets.sessionId, workoutSessions.id))
                .where(
                    and(
                        eq(exerciseSets.exerciseId, input.exerciseId),
                        eq(workoutSessions.status, "completed")
                    )
                )
                .orderBy(desc(workoutSessions.completedAt))
                .limit(1);

            return sessions[0];
        }),
}); 