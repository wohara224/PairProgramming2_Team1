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

## 画面構成

### 起動時

通常起動

``` bash
========================================
【タスク管理スタブ】が起動しました
   ポート番号: 8080
========================================
ペアのPC（クライアント）からの通信を待っています...
```

localhost起動

``` bash
========================================
【タスク管理スタブ】が起動しました
   ポート番号: 8080 (localhost)
========================================
ペアのPC（クライアント）からの通信を待っています...
```

### エラー時

起動失敗時

``` bash
サーバーが起動できませんでした。：Error=～～～～～～～～
アプリケーションを終了します．．．
```

### リクエスト受信時

通信待機中

``` bash
2026-06-05 16:18:26 192.168.100.24  GET     /api/scores/student?id=1        200 OK
2026-06-05 16:18:28 192.168.100.24  GET     /api/scores/student?id=43       404 NotFound
2026-06-05 16:18:18 192.168.100.24  GET     /api/scores/student?id=abc      400 BadRequest
2026-06-05 16:18:18 192.168.100.24  POST    /api/scores/student?id=abc      405 MethodNotAllowed
```

## ログ定義

- GradeJudge.Server.System：通信ログ
- GradeJudge.Server.Api：システムログ
- Microsoft.* / System.* は除外し、アプリケーション固有のみを対象とする

システムログ
``` text:system-20260605.log
2026-06-05 16:18:28.882|INFO|GradeJudge.Server.System|アプリケーション起動|
2026-06-05 16:18:29.591|FITAL|GradeJudge.Server.System|エラー: サーバー起動失敗|アクセスが拒否されました。
2026-06-05 16:18:29.689|INFO|GradeJudge.Server.System|アプリケーション終了：Exit=1|
2026-06-05 16:29:47.904|INFO|GradeJudge.Server.System|アプリケーション起動|
2026-06-05 16:29:47.992|INFO|GradeJudge.Server.System|リスナー起動：Port 8080|
```

通信ログ
``` text:api-20260608.log
2026-06-08 09:12:17.1020|INFO|GradeJudge.Server.Api|リクエスト受信：API=/api/ Method=GET|
2026-06-08 09:12:17.2183|WARN|GradeJudge.Server.Api|リクエスト異常：URL不正|
2026-06-08 09:12:17.2591|INFO|GradeJudge.Server.Api|レスポンス送信：Status=405|
2026-06-08 09:13:17.7008|INFO|GradeJudge.Server.Api|リクエスト受信：API=/api/performance Method=GET|
2026-06-08 09:13:17.7255|WARN|GradeJudge.Server.Api|リクエスト異常：クエリ不正 Query=|
2026-06-08 09:13:17.7255|INFO|GradeJudge.Server.Api|レスポンス送信：Status=400|
2026-06-08 09:13:34.2450|INFO|GradeJudge.Server.Api|リクエスト受信：API=/api/performance?student=1 Method=GET|
2026-06-08 09:13:34.2450|WARN|GradeJudge.Server.Api|リクエスト異常：クエリ不正 Query=?student=1|
2026-06-08 09:13:34.2450|INFO|GradeJudge.Server.Api|レスポンス送信：Status=400|
2026-06-08 09:13:43.8865|INFO|GradeJudge.Server.Api|リクエスト受信：API=/api/performance?studentId=1 Method=GET|
2026-06-08 09:13:43.8865|WARN|GradeJudge.Server.Api|リクエスト異常：クエリ不正 Query=?studentId=1|
2026-06-08 09:13:43.8865|INFO|GradeJudge.Server.Api|レスポンス送信：Status=400|
2026-06-08 09:14:08.3664|INFO|GradeJudge.Server.Api|リクエスト受信：API=/api/performance?id=1 Method=GET|
2026-06-08 09:14:08.4014|INFO|GradeJudge.Server.Api|リクエスト正常|
2026-06-08 09:14:08.4014|INFO|GradeJudge.Server.Api|レスポンス送信：Status=200|
```


