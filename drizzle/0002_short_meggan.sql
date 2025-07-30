CREATE TABLE `strongher_exercise_set` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`sessionId` bigint NOT NULL,
	`exerciseId` bigint NOT NULL,
	`setNumber` int NOT NULL,
	`weight` decimal(5,2),
	`reps` int,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strongher_exercise_set_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strongher_exercise` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`workoutDayId` bigint NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`sets` int NOT NULL,
	`reps` varchar(50) NOT NULL,
	`order` int NOT NULL,
	`musclesWorked` text,
	`howToDo` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strongher_exercise_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strongher_todo` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`completed` boolean NOT NULL DEFAULT false,
	`priority` varchar(10) NOT NULL DEFAULT 'medium',
	`dueDate` date,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strongher_todo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strongher_workout_day` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`programId` bigint NOT NULL,
	`name` varchar(100) NOT NULL,
	`focus` varchar(200),
	`notes` text,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strongher_workout_day_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strongher_workout_program` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`duration` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strongher_workout_program_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strongher_workout_session` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`workoutDayId` bigint NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'in_progress',
	`startedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strongher_workout_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `mynewapplication_post`;--> statement-breakpoint
DROP TABLE `mynewapplication_todo`;--> statement-breakpoint
CREATE INDEX `session_id_idx` ON `strongher_exercise_set` (`sessionId`);--> statement-breakpoint
CREATE INDEX `exercise_id_idx` ON `strongher_exercise_set` (`exerciseId`);--> statement-breakpoint
CREATE INDEX `set_number_idx` ON `strongher_exercise_set` (`setNumber`);--> statement-breakpoint
CREATE INDEX `workout_day_id_idx` ON `strongher_exercise` (`workoutDayId`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `strongher_exercise` (`order`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `strongher_todo` (`title`);--> statement-breakpoint
CREATE INDEX `completed_idx` ON `strongher_todo` (`completed`);--> statement-breakpoint
CREATE INDEX `priority_idx` ON `strongher_todo` (`priority`);--> statement-breakpoint
CREATE INDEX `program_id_idx` ON `strongher_workout_day` (`programId`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `strongher_workout_day` (`order`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `strongher_workout_program` (`name`);--> statement-breakpoint
CREATE INDEX `workout_day_id_idx` ON `strongher_workout_session` (`workoutDayId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `strongher_workout_session` (`status`);