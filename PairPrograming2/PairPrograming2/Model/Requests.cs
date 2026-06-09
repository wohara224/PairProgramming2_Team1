namespace PairPrograming2.Model;

// データ登録
public record AddReq(string TaskName, int TaskPriority);

// 優先度変更
public record EditPriorityReq(int TaskId, int TaskPriority);

//ステータス変更
public record EditStatusReq(int TaskId, int TaskStatus);

// データ削除
public record DeleteReq(int TaskId);
