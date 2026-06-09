using PairPrograming2.Model;

namespace PairPrograming2.Repositories;

public interface ISqlRepository
{
    Task<IEnumerable<TaskItem>> GetTasks();
    Task AddTask(AddReq req);
    Task UpdatePriority(EditPriorityReq req);
    Task UpdateStatus(EditStatusReq req);
    Task DeleteTask(int TaskId);
}
