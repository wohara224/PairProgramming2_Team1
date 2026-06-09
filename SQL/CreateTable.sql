CREATE TABLE tasks (
	task_id INT IDENTITY (1,1) PRIMARY KEY,
	task_name NVARCHAR(30) NOT NULL,
	task_priority INT NOT NULL DEFAULT 1,
	task_limit DATE NOT NULL DEFAULT DATEADD(day, 7, GETDATE()),
	task_status INT NOT NULL DEFAULT 0
);

INSERT INTO tasks(
	task_name,
	task_priority,
	task_status
)
VALUES(
	N'Task1',
	2,
	0
);

INSERT INTO tasks(
	task_name,
	task_priority
)
VALUES(
	N'Task2',
	2
);

SELECT
	task_id AS TaskId,
	task_name AS Title,
	task_priority AS TaskPriority,
	task_limit AS TaskLimit,
	task_status AS TaskStatus
FROM tasks;



DROP TABLE tasks;