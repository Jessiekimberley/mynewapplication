// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, mysqlTableCreator, varchar } from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator(
  (name) => `mynewapplication_${name}`,
);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp().onUpdateNow(),
  }),
  (t) => [index("name_idx").on(t.name)],
);

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
