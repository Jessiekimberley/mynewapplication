import { sql } from "drizzle-orm";
import { index, mysqlTableCreator, varchar, text, int, boolean, timestamp, decimal } from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator(
  (name) => `strongher_${name}`,
);

// Workout Programs (e.g., STRONGHER Build)
export const workoutPrograms = createTable(
  "workout_program",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    duration: d.varchar({ length: 100 }), // e.g., "6 weeks"
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [index("name_idx").on(t.name)],
);

// Workout Days (e.g., Day 1, Day 2, Day 3, Bonus Day)
export const workoutDays = createTable(
  "workout_day",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    programId: d.bigint({ mode: "number" }).notNull(),
    name: d.varchar({ length: 100 }).notNull(), // e.g., "Day 1", "Day 2"
    focus: d.varchar({ length: 200 }), // e.g., "Posterior Chain Strength"
    notes: d.text(),
    order: d.int().notNull(), // For sorting
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [
    index("program_id_idx").on(t.programId),
    index("order_idx").on(t.order),
  ],
);

// Exercises
export const exercises = createTable(
  "exercise",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    workoutDayId: d.bigint({ mode: "number" }).notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    sets: d.int().notNull(),
    reps: d.varchar({ length: 50 }).notNull(), // e.g., "8", "10/leg", "30s/side"
    order: d.int().notNull(),
    musclesWorked: d.text(),
    howToDo: d.text(),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [
    index("workout_day_id_idx").on(t.workoutDayId),
    index("order_idx").on(t.order),
  ],
);

// Workout Sessions (when user starts a workout)
export const workoutSessions = createTable(
  "workout_session",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    workoutDayId: d.bigint({ mode: "number" }).notNull(),
    status: d.varchar({ length: 20 }).default("in_progress").notNull(), // "not_started", "in_progress", "completed"
    startedAt: d.timestamp().default(sql`CURRENT_TIMESTAMP`).notNull(),
    completedAt: d.timestamp(),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [
    index("workout_day_id_idx").on(t.workoutDayId),
    index("status_idx").on(t.status),
  ],
);

// Exercise Sets (individual sets within a session)
export const exerciseSets = createTable(
  "exercise_set",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    sessionId: d.bigint({ mode: "number" }).notNull(),
    exerciseId: d.bigint({ mode: "number" }).notNull(),
    setNumber: d.int().notNull(), // 1, 2, 3, etc.
    weight: d.decimal({ precision: 5, scale: 2 }), // kg or lbs
    reps: d.int(),
    completed: d.boolean().default(false).notNull(),
    completedAt: d.timestamp(),
    notes: d.text(),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [
    index("session_id_idx").on(t.sessionId),
    index("exercise_id_idx").on(t.exerciseId),
    index("set_number_idx").on(t.setNumber),
  ],
);

// Keep the existing todos table for now
export const todos = createTable(
  "todo",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    title: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    completed: d.boolean().default(false).notNull(),
    priority: d.varchar({ length: 10 }).default("medium").notNull(),
    dueDate: d.date(),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [
    index("title_idx").on(t.title),
    index("completed_idx").on(t.completed),
    index("priority_idx").on(t.priority),
  ],
);
