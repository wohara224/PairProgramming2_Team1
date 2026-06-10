# フロントエンド設計

## ID / Class 名

### 静的要素
- 新規タスク入力欄 : id="new-task-title"
- 優先度選択(プルダウン) : id="new-task-priority"
- 登録ボタン : id="add-task-btn"
- タスク一覧 : id="task-list"

### 動的要素(タスク数だけ自動生成されるボタン等には識別用のIDを割り振り)
- 完了/未完了チェックボックス : class="task-status-check" data-id="123"
- 優先度変更(プルダウン) : class="task-priority-select" data-id="123"
- 削除ボタン : class="btn-delete-task" data-id="123"
