using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PairPrograming2.Model;
using PairPrograming2.Repositories;
using NLog;

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

    [HttpGet]
    public async Task<IEnumerable<TaskItem>> GetTasks()
    {
        var tasks = await _sqlRepository.GetTasks();



        return await _sqlRepository.GetTasks();
    }
}
