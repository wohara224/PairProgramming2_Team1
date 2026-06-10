using PairPrograming2.Model;

namespace PairPrograming2.Repositories;

public interface ISqlRepository
{
    Task<IEnumerable<TaskItem>> GetTasks();
    Task AddTask(AddReq req);
    Task<int> UpdatePriority(EditPriorityReq req);
    Task<int> UpdateStatus(EditStatusReq req);
    Task<int> DeleteTask(int TaskId);
}
