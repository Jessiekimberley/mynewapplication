CREATE TABLE `mynewapplication_todo` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`completed` boolean NOT NULL DEFAULT false,
	`priority` varchar(10) NOT NULL DEFAULT 'medium',
	`dueDate` date,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mynewapplication_todo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `title_idx` ON `mynewapplication_todo` (`title`);--> statement-breakpoint
CREATE INDEX `completed_idx` ON `mynewapplication_todo` (`completed`);--> statement-breakpoint
CREATE INDEX `priority_idx` ON `mynewapplication_todo` (`priority`);