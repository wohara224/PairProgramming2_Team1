# 仕様書

## メンバ

- 永野☆　・・・　クライアント側実装(JS)
- 大原　・・・　サーバー側実装、データ定義
- 福山　・・・　クライアント側実装(HTML/CSS)

## コンセプト

簡易ToDoアプリ


## 必須要件

サーバー
- ASP.NET Core Web APIを使用し、データの”GET”と”POST”ができる
- 共通のJSONを使用し、ステータスコードを正しく返却する

クライアント
- JavaScriptの fetch API を用いて、裏側でC#のAPIサーバーと非同期で通信を行う
- ボタンを押した瞬間に、データだけが画面で書き換わるモダンな挙動を実現する

ロギング
- サーバー：アプリ動作、通信内容

## 機能

サーバー：
- DBとの通信
- JSからのリクエスト処理

クライアント：
- 一覧表示
- 新規登録
- 削除

## 処理の流れ

[GET] データ一覧取得
1. ページ起動時およびデータ操作後にリクエスト
2. 基本全件取得
    - 正常なリクエスト：200
    - POST以外のリクエスト：405

[POST] データ登録
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを登録し、結果を返す
    - 正常なリクエスト：204
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - タスク名が空白：400（TITLE_IS_NULL）
    - タスク名が30文字以上：400（TITLE_OVER_LENGTH）
    - 優先度の値が範囲外：400（INVALID_PRIORITY）
  
[POST] 優先度変更
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを変更し、結果を返す
    - 正常なリクエスト：204
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - 優先度の値が範囲外：400（INVALID_PRIORITY）
    - 指定したデータがない：404（TASK_NOT_FOUND）
    

[POST] ステータス変更
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを変更し、結果を返す
    - 正常なリクエスト：204
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - ステータスの値が範囲外：400（INVALID_STATUS）
    - 指定したデータがない：404（TASK_NOT_FOUND）

[POST] データ削除
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを削除し、結果を返す
    - 正常なリクエスト：204
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - 指定したデータがない：404（TASK_NOT_FOUND）

DBとの通信異常 -> 500（SYSTEM_ERROR）
その他URLでのアクセス -> 404 Not Found

## API仕様

- 接続URL：http://xxx.xxx.xxx.xxx:8080/api/Todo

## リクエストボディ

一覧取得

[GET] /index
``` json
{}
```

データ登録

[POST] /add
``` json
{
  "taskName": "XXX",
  "taskPriority": 1
}
```

優先度変更

[POST] /editpriorty
``` json
{
  "taskId": 1,
  "taskPriority": 2
}
```

ステータス変更

[POST] /editstatus
``` json
{
  "taskId": 1,
  "taskStatus": 1
}
```

データ削除

[POST] /delete
``` json
{
  "taskId": 1
}
```

## レスポンスボディ (正常系)

一覧取得

/index
``` json
{
  "tasks":[
    {"taskId": 1, "taskName": "XXX", "taskPriority": 1, "taskStatus": 1 },
    {"taskId": 2, "taskName": "XXX", "taskPriority": 2, "taskStatus": 1 },
    {"taskId": 3, "taskName": "XXX", "taskPriority": 3, "taskStatus": 0 },
    {"taskId": 4, "taskName": "XXX", "taskPriority": 1, "taskStatus": 0 }
  ]
}
```

データ登録

/add
``` json
{}
```

優先度変更

/editpriorty
``` json
{}
```

ステータス変更

/editstatus
``` json
{}
```

データ削除
/delete
``` json
{}
```

## レスポンスボディ （異常系）

一覧取得

/index / GET以外のメソッドを受信した（405）
``` json
{}
```

データ登録

/add / POST以外のメソッドを受信した（405）
``` json
{}
```

/add / JSONがおかしい、変換できない（400）
``` json
{ "message": "INVALID_REQUEST" }
```

/add / タスク名がない（400）
``` json
{ "message": "TITLE_IS_NULL" }
```

/add / タスク名が30文字以上（400）
``` json
{ "message": "TITLE_OVER_LENGTH" }
```

/add / 優先度の値が範囲外（400）
``` json
{ "message": "INVALID_PRIORITY" }
```

優先度変更

/editpriorty / GET以外のメソッドを受信した（405）
``` json
{}
```

/editpriorty / JSONがおかしい、変換できない（400）
``` json
{ "message": "INVALID_REQUEST" }
```

/editpriorty / 優先度の値が範囲外（400）
``` json
{ "message": "INVALID_PRIORITY" }
```

/editpriorty / タスクが存在しない（404）
``` json
{ "message": "TASK_NOT_FOUND" }
```

ステータス変更

/editstatus / GET以外のメソッドを受信した（405）
``` json
{}
```

/editstatus / JSONがおかしい、変換できない（400）
``` json
{ "message": "INVALID_REQUEST" }
```

/editstatus / ステータスの値が範囲外（400）
``` json
{ "message": "INVALID_STATUS" }
```

/editstatus / タスクが存在しない（404）
``` json
{ "message": "TASK_NOT_FOUND" }
```

データ削除

/delete / GET以外のメソッドを受信した（405）
``` json
{}
```

/delete / JSONがおかしい、変換できない（400）
``` json
{ "message": "INVALID_REQUEST" }
```

/delete / タスクが存在しない（404）
``` json
{ "message": "TASK_NOT_FOUND" }
```

その他

URLが上記以外のもの（404）
``` json
{}
```

システムエラー（500）
``` json
{ "message": "SYSTEM_ERROR" }
```

## 課題
- 複数のPCから同時にデータを編集した場合の対策
- 期限の活用
- Userテーブルの追加と結合

