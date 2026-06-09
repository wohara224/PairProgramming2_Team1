using Dapper;
using Microsoft.Data.SqlClient;
using PairPrograming2.Model;

namespace PairPrograming2.Repositories;

public class SqlRepository : ISqlRepository
{
    private readonly IConfiguration _config;

    // DI
    public SqlRepository(IConfiguration config)
    {
        _config = config;
    }

    public async Task<IEnumerable<TaskItem>> GetTasks()
    {
        using var connection
            = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        var sql = @"
            SELECT
                task_id AS TaskId,
                task_name AS TaskName,
                task_priority AS TaskPriority,
                task_limit AS TaskLimit,
                task_status AS TaskStatus
            FROM tasks
            ORDER BY task_id;";

        var tasks = await connection.QueryAsync<TaskItem>(sql);
        return tasks;
    }

    public async Task AddTask(AddReq req)
    {
        using var connection
            = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        var sql = @"
            INSERT INTO tasks(
	            task_name,
	            task_priority
                )
            VALUES(
                @TaskName,
                @TaskPriority
            );";

        await connection.ExecuteAsync(sql, req); 
    }

    public async Task UpdatePriority(EditPriorityReq req)
    {
        using var connection
            = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        var sql = @"
            UPDATE tasks
            SET task_priority = @TaskPriority
            WHERE task_id = @TaskId;";

        await connection.ExecuteAsync(sql, req);
    }

    public async Task UpdateStatus(EditStatusReq req)
    {
        using var connection
            = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        var sql = @"
            UPDATE tasks
            SET task_status = @TaskStatus
            WHERE task_id = @TaskId;";

        await connection.ExecuteAsync(sql, req);
    }

    public async Task DeleteTask(int TaskId)
    {
        using var connection
            = new SqlConnection(_config.GetConnectionString("DefaultConnection"));

        var sql = @"
            DELETE FROM tasks
            WHERE task_id = @TaskId;";

        await connection.ExecuteAsync(sql, new { TaskId });
    }

}
