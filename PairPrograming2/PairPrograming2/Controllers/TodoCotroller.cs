using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;
using PairPrograming2.Model;
using PairPrograming2.Repositories;

namespace PairPrograming2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoController : ControllerBase
{
    private readonly ISqlRepository _sqlRepository;
    private readonly ILogger<TodoController> _logger;

    public TodoController(ISqlRepository sqlRepository, ILogger<TodoController> logger)
    {
        _sqlRepository = sqlRepository;
        _logger = logger;
    }

    [HttpGet("index")]
    public async Task<ActionResult<IndexRes>> GetTasks()
    {
        _logger.LogInformation("Get Request");
        var tasks = await _sqlRepository.GetTasks();

        var responce = new IndexRes(
            tasks.Select(t => new TaskSummary(
                t.TaskId,
                t.TaskName,
                t.TaskPriority,
                t.TaskStatus
                )).ToList()); 

        return Ok(responce);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddTask(AddReq req)
    {
        _logger.LogInformation("タスク追加:TaskName={0}",req.TaskName);

        if (string.IsNullOrWhiteSpace(req.TaskName))
        {
            _logger.LogWarning("タスク名無し IP:{Ip}", HttpContext.Connection.RemoteIpAddress);
            return BadRequest(new ErrorRes("TITLE_IS_NULL"));
        }

        await _sqlRepository.AddTask(req);

        _logger.LogInformation("追加完了");

        return NoContent();
    }

    [HttpPost("editpriorty")]
    public async Task<IActionResult> UpdatePriority(EditPriorityReq req)
    {
        _logger.LogInformation("優先度編集:TaskId={0}", req.TaskId);

        int rows = await _sqlRepository.UpdatePriority(req);

        if(rows == 0)
        {
            _logger.LogWarning("該当タスク無し IP:{Ip}", HttpContext.Connection.RemoteIpAddress);

            return NotFound(new ErrorRes("TASK_NOT_FOUND"));
        }

        _logger.LogInformation("編集完了");

        return NoContent();
    }

    [HttpPost("editstatus")]
    public async Task<IActionResult> UpdateStatus(EditStatusReq req)
    {
        _logger.LogInformation("ステータス編集:TaskId={0}", req.TaskId);

        int rows = await _sqlRepository.UpdateStatus(req);

        if (rows == 0)
        {
            _logger.LogWarning("該当タスク無し IP:{Ip}", HttpContext.Connection.RemoteIpAddress);

            return NotFound(new ErrorRes("TASK_NOT_FOUND"));
        }

        _logger.LogInformation("編集完了");

        return NoContent();
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteTask(DeleteReq req)
    {
        _logger.LogInformation("タスク削除:TaskId={0}", req.TaskId);

        int rows = await _sqlRepository.DeleteTask(req.TaskId);

        if (rows == 0)
        {
            _logger.LogWarning("該当タスク無し IP:{Ip}", HttpContext.Connection.RemoteIpAddress);

            return NotFound(new ErrorRes("TASK_NOT_FOUND"));
        }

        _logger.LogInformation("削除完了");

        return NoContent();
    }
}
