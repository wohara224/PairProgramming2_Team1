# 仕様書

## メンバ

- 永野☆　・・・　クライアント側実装(JS)
- 大原　・・・　サーバー側実装、データ定義
- 福山　・・・　クライアント側実装(HTML/CSS)

## コンセプト

簡易ToDo(仮)


## 必須要件

サーバー
- ASP.NET Core Web APIを使用し、データの”GET”と”POST”ができる
- 共通のJSONを使用し、ステータスコードを正しく返却する

クライアント
- JavaScriptの fetch API を用いて、裏側でC#のAPIサーバーと非同期で通信を行う
- ボタンを押した瞬間に、データだけが画面に書き換わるモダンな挙動を実現する

ロギング
- クライアント：アプリ動作
- サーバー：アプリ動作（システムログ）、通信内容（APIログ）

## 機能

サーバー：
- DBとの通信
- JSからのリクエスト処理

クライアント：
- 一覧表示
- 新規登録
- 削除
- ＊リロード無しで行う

## 処理の流れ

[GET] データ一覧取得
1. ページ起動時およびデータ操作後にリクエスト
2. 基本全件取得
    - 正常なリクエスト：200
    - POST以外のリクエスト：405

[POST] データ登録
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを登録し、結果を返す
    - 正常なリクエスト：200
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - タイトルが空白：400（TITLE_IS_NULL）
  
[POST] 優先度変更
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを変更し、結果を返す
    - 正常なリクエスト：200
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - 指定したデータがない：404（TASK_NOT_FOUND）

[POST] ステータス変更
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを変更し、結果を返す
    - 正常なリクエスト：200
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - 指定したデータがない：404（TASK_NOT_FOUND）

[POST] データ削除
1. クライアントから登録情報をもらう
2. バリデーションチェック後にデータを削除し、結果を返す
    - 正常なリクエスト：200
    - POST以外のリクエスト：405
    - JSONが不正；400（INVALID_REQUEST）
    - 指定したデータがない：404（TASK_NOT_FOUND）

その他のURLアクセス -> 404 Not Found

## API仕様

- 接続URL：http://xxx.xxx.xxx.xxx:8080/api

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
  "title": "XXX",
  "priority": 1
}
```

優先度変更

[POST] /editprirorty
``` json
{
  "taskid": 1,
  "priority": 2
}
```

ステータス変更

[POST] /editstatus
``` json
{
  "taskid": 1,
  "status": 1
}
```

データ削除

[POST] /delete
``` json
{
  "taskid": 1
}
```

## レスポンスボディ (正常系)

一覧取得

/index
``` json
{
  "tasks":[
    {"taskid": 1, "title": "XXX", "priority": 1, "status": 1 },
    {"taskid": 2, "title": "XXX", "priority": 2, "status": 1 },
    {"taskid": 3, "title": "XXX", "priority": 3, "status": 0 },
    {"taskid": 4, "title": "XXX", "priority": 1, "status": 0 }
  ]
}
```

データ登録

/add
``` json
{}
```

データ変更

/edit
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
{
  "errors": [
    { "message": "INVALID_REQUEST" }
  ]
}
```

/add / タスク名がない（400）
``` json
{
  "errors": [
    { "message": "TITLE_IS_NULL" }
  ]
}
```

データ変更

/edit / GET以外のメソッドを受信した（405）
``` json
{}
```

/edit / JSONがおかしい、変換できない（400）
``` json
{
  "errors": [
    { "message": "INVALID_REQUEST" }
  ]
}
```

/edit / タスクが存在しない（404）
``` json
{
  "errors": [
    { "message": "TASK_NOT_FOUND" }
  ]
}
```

データ削除

/delete / GET以外のメソッドを受信した（405）
``` json
{}
```

/delete / JSONがおかしい、変換できない（400）
``` json
{
  "errors": [
    { "message": "INVALID_REQUEST" }
  ]
}
```

/delete / タスクが存在しない（404）
``` json
{
  "errors": [
    { "message": "TASK_NOT_FOUND" }
  ]
}
```

その他

URLが上記以外のもの（404）
``` json
{}
```

