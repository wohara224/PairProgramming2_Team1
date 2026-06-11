# サーバー設計書

## 環境

Nugetパッケージ
- Dapper : SQL操作
- Microsoft.Data.SqlClient : DB通信パッケージ
- Microsoft.AspNetCore.OpenAPI : Aip通信パッケージ
- NLog.Web.AspNetCore : ログ出力
- NLog

## データ定義

TaskItem
- タスク番号：TaskId (int)
- タスク名：TaskName (string)
- 優先度：TaskPriority (int)
- 期限：TaskLimit (DateTime)
- 完了/未完了：TaskStatus (int)
- バージョン：TaskVersion (int)

## リクエスト用DTO

一覧取得：なし

データ登録：AddReq
- タスク名：TaskName (string)
- 優先度：TaskPriority (int)

優先度編集：EditPrirortyReq
- タスクID：TaskId (int)
- 優先度：TaskPriority (int)

ステータス編集：EditStatusReq
- タスクID：TaskId (int)
- 完了/未完了：TaskStatus (int)

データ削除：DeleteReq
- タスクID：TaskId (int)

## レスポンス用DTO

一覧取得：IndexRes
- タスク一覧：Tasks (List:TaskSummary)

タスク個別のステータス：TaskSummary
- タスクID：TaskId (int)
- タスク名：TaskName (string)
- 優先度：TaskPrirorty (int)
- 完了/未完了：TaskStatus (int)

汎用エラー：ErrorRes
  - エラーアイテム：Errors (ErrorItem)

エラーアイテム：ErrorItem
- エラー内容：Message (string)

## DB定義

tasks
- task_id INT IDENTITY (1,1) PK,
- task_name NVARCHAR(30) NOT NULL,
- task_priority INT NOT NULL DEFAULT 1,
- task_limit DATE DEFAULT DATEADD(day, 7, GETDATE()),
- task_status INT NOT NULL DEFAULT 0
- task_version INT NOT NULL DEFAULT 0

## コンソール

### 起動時

``` bash
Application Started
```

### リクエスト受信時

一覧取得

``` bash
Get Requsest
```

データ追加

``` bash
Add Task:TaskName=Task5
Add Complete
```

優先度変更

``` bash
Edit Priority:TaskId=2
Edit Complete
```

ステータス変更

``` bash
Edit Status:TaskId=2
Edit Complete
```

データ削除

``` bash
Delete TaskId=1005
Delete Complete
```

## ログ定義

システムログ (抜粋)
``` text:system-2026-06-11.log
2026-06-11 13:09:31.2381|INFO|Program|Application started.|
2026-06-11 13:09:31.7827|INFO|PairPrograming2.Controllers.TodoController|Get Request|
2026-06-11 13:09:36.2898|INFO|PairPrograming2.Controllers.TodoController|ステータス編集:TaskId=2|
2026-06-11 13:09:36.3315|INFO|PairPrograming2.Controllers.TodoController|編集完了|
2026-06-11 13:09:36.3411|INFO|PairPrograming2.Controllers.TodoController|Get Request|
2026-06-11 13:09:36.5721|INFO|PairPrograming2.Controllers.TodoController|ステータス編集:TaskId=2|
2026-06-11 13:09:36.5781|INFO|PairPrograming2.Controllers.TodoController|編集完了|
2026-06-11 13:09:36.5781|INFO|PairPrograming2.Controllers.TodoController|Get Request|
2026-06-11 13:09:38.2378|INFO|PairPrograming2.Controllers.TodoController|優先度編集:TaskId=2|
2026-06-11 13:09:38.2623|INFO|PairPrograming2.Controllers.TodoController|編集完了|
2026-06-11 13:09:38.2623|INFO|PairPrograming2.Controllers.TodoController|Get Request|
2026-06-11 13:09:39.5910|INFO|PairPrograming2.Controllers.TodoController|優先度編集:TaskId=2|
2026-06-11 13:09:39.6125|INFO|PairPrograming2.Controllers.TodoController|編集完了|
2026-06-11 13:09:39.6125|INFO|PairPrograming2.Controllers.TodoController|Get Request|
2026-06-11 13:11:43.9402|INFO|PairPrograming2.Controllers.TodoController|タスク追加:TaskName=Task4|
2026-06-11 13:11:43.9402|INFO|PairPrograming2.Controllers.TodoController|追加完了|
2026-06-11 13:11:43.9534|INFO|PairPrograming2.Controllers.TodoController|Get Request|

```




