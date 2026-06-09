namespace PairPrograming2.Model;

// 一覧取得
public record IndexRes(List<TaskSummary> Tasks);

// 内部レコード
public record TaskSummary(int TaskId,string TaskName,int TaskPriority,int TaskStatus);

// 汎用エラー
