//JSONダミーデータ
const data = {
    "tasks": [
        { "taskid": 1, "taskname": "発表資料作成", "taskpriority": 1, "taskstatus": 1 },
        { "taskid": 2, "taskname": "API実装", "taskpriority": 2, "taskstatus": 1 },
        { "taskid": 3, "taskname": "画面デザイン調整", "taskpriority": 3, "taskstatus": 0 },
        { "taskid": 4, "taskname": "バグ修正", "taskpriority": 1, "taskstatus": 0 }
    ]
};

///////////////////////////////////////////////////////////////////////////////////////////

//動作確認用ボタンがクリックされたとき
let button = document.getElementById("delete");
button.addEventListener("click", () => {
    fetchTask();
});

//新規登録ボタンが押されたとき
let addButton = document.getElementById("add-task-btn");
addButton.addEventListener("click", () => {
    addTask();
});

//削除ボタンが押されたとき
let deleteButton = document.getElementsByClassName("btn-delete-task");
deleteButton.addEventListener("click", () => {
    const taskId = event.target.getAttribute('data-id');
    deleteTask();
});

//リスト内の何かが変更されたとき
document.addEventListener('DOMContentLoaded', () => {

    const taskList = document.getElementById('task-list');

    taskList.addEventListener('change', async (event) => {

        if (event.target.classList.contains('task-status-check')) {
            const taskId = event.target.getAttribute('data-id');
            await sendDeletePost(taskId);
        }

        if (event.target.classList.contains('task-priority-select')) {
            const taskId = event.target.getAttribute('data-id');
            await sendDeletePost(taskId);
        }
    })
});

//サーバーから取得したデータを入れる
var fetchedTasks = [];

async function fetchTask() {

    try {
        // C#のコントローラー（api/todos）にデータをちょうだいとリクエスト
        const response = await fetch('/api/todo');

        if (response.ok) {
            // 届いたJSONデータをJavaScriptの配列に変換して格納
            fetchedTasks = await response.json();
            console.log("サーバーからデータを取得しました:", mockTasks);
        } else {
            console.error("サーバーエラーが発生しました");
        }
    } catch (error) {
        console.error("通信に失敗しました:", error);
    }

    //HTMLからId=task-listの内容を取得
    const taskList = document.getElementById('task-list');

    //一旦クリア
    taskList.innerHTML = '';

    //ダミーデータ代入
    fetchedTasks = data;

    //JOSN内のデータの数だけforeachでループ
    fetchedTasks.tasks.forEach(fetchedTasks => {
        // ステータスに応じてチェック状態(checked)を判定
        // taskstatus: 1=完了(checked属性あり), 0=未完了(属性なし)
        const isChecked = fetchedTasks.taskstatus === 1 ? 'checked' : '';

        // 優先度に応じてセレクト状態(select)を判定
        // taskpriority: 1 = 高, 2 = 中, 3 = 低
        const selectHigh = fetchedTasks.taskpriority === 1 ? 'selected' : '';
        const selectMedium = fetchedTasks.taskpriority === 2 ? 'selected' : '';
        const selectLow = fetchedTasks.taskpriority === 3 ? 'selected' : '';

        // 解析した内容を元にHTMLを作成
        const taskHtml = `
        <div class="task-item">
            <input type="checkbox" class="task-status-check" data-id="${fetchedTasks.taskid}" ${isChecked}>
            
            <span class="task-title">${fetchedTasks.taskname}</span>

            <select class="task-priority-select" data-id="${fetchedTasks.taskid}">
                <option value="1" ${selectHigh}>高</option>
                <option value="2" ${selectMedium}>中</option>
                <option value="3" ${selectLow}>低</option>
            </select>

            <button class="btn-delete-task" data-id="${fetchedTasks.taskid}">削除</button>
        </div>
        `;

        //作成したHTMLをtaskListの下に追加していく
        taskList.insertAdjacentHTML('beforeend', taskHtml);
    })

}

async function addTask() {
    let newTaskNameInput = document.getElementById("new-task-title");
    let newTaskPriorityInput = document.getElementById("new-task-priority");
    const newTaskName = newTaskNameInput.value;
    const newTaskPriority = newTaskPriorityInput.value;

    console.log(newTaskName);
    console.log(newTaskPriority);

    //新規作成POST用
    const newTask = {
        taskname: newTaskName,
        taskpriority: newTaskPriority
    };

    const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify('newTask')
    });

    const result = await response.json();
    console.log("登録結果:", result);
}