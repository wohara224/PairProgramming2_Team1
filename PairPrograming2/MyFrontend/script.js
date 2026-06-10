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

//サーバーから取得したデータを入れる
var fetchedTasks = [];

//動作確認用ボタンがクリックされたとき
let button = document.getElementById("delete");
button.addEventListener("click", () => {
    fetchTasks();
});

//新規登録ボタンが押されたとき
let addButton = document.getElementById("add-task-btn");
addButton.addEventListener("click", () => {
    addTask();
});

//リスト内の何かが変更、クリックされたとき
document.addEventListener('DOMContentLoaded', () => {

    const taskList = document.getElementById('task-list');

    taskList.addEventListener('click', async (event) => {

        if (event.target.classList.contains('btn-delete-task')) {
            const taskId = event.target.getAttribute('data-id');
            await deleteTask(parseInt(taskId));
        }
    });

    taskList.addEventListener('change', async (event) => {

        if (event.target.classList.contains('task-status-check')) {
            const taskId = event.target.getAttribute('data-id');
            const isChecked = event.target.checked ? 1 : 0;
            await updateTaskStatus(parseInt(taskId), parseInt(isChecked));
        }

        else if (event.target.classList.contains('task-priority-select')) {
            const taskId = event.target.getAttribute('data-id');
            const taskPriority = event.target.value;
            await updateTaskPriority(parseInt(taskId), parseInt(taskPriority));
        }
    })
});

//1.一覧取得
async function fetchTasks() {

    try {
        // C#のコントローラー（api/todos）にデータをちょうだいとリクエスト
        const response = await fetch('/api/todo');

        if (response.ok) {
            // 届いたJSONデータをJavaScriptの配列に変換して格納
            fetchedTasks = await response.json();
            console.log("サーバーからデータを取得しました:", fetchedTasks);
        } else {
            if (response.status === 405) {
                console.error("リクエストの送信方式がサーバー側と一致していません。");
                alert("リクエストの送信方式がサーバー側と一致していません。\nステータスコード: 405 " + response.statusText);
            }
            else if (response.status === 404) {
                console.error("リクエストしたURLが見つかりません。");
                alert("リクエストしたURLが見つかりません  :  " + response.url + "\nステータスコード: 404 " + response.statusText);
            }
            else {
                console.error("サーバーエラーが発生しました");
                alert("サーバーエラーが発生しました:\nステータスコード: " + response.status);
            }
        }
    } catch (error) {
        console.error("通信に失敗しました: ", error);
        alert("通信に失敗しました:\n" + error.message);
    }

    //HTMLからId=task-listの内容を取得
    const taskList = document.getElementById('task-list');

    //一旦クリア
    taskList.innerHTML = '';

    //ダミーデータ代入
    // fetchedTasks = data;

    //JOSN内のデータの数だけforeachでループ
    fetchedTasks.tasks.forEach(task => {
        // ステータスに応じてチェック状態(checked)を判定
        // taskstatus: 1=完了(checked属性あり), 0=未完了(属性なし)
        const isChecked = task.taskstatus === 1 ? 'checked' : '';

        // 優先度に応じてセレクト状態(select)を判定
        // taskpriority: 1 = 高, 2 = 中, 3 = 低
        const selectHigh = task.taskpriority === 1 ? 'selected' : '';
        const selectMedium = task.taskpriority === 2 ? 'selected' : '';
        const selectLow = task.taskpriority === 3 ? 'selected' : '';

        // 解析した内容を元にHTMLを作成
        const taskHtml = `
        <div class="task-item">
            <input type="checkbox" class="task-status-check" data-id="${task.taskid}" ${isChecked}>
            
            <span class="task-title">${task.taskname}</span>

            <select class="task-priority-select" data-id="${task.taskid}">
                <option value="1" ${selectHigh}>高</option>
                <option value="2" ${selectMedium}>中</option>
                <option value="3" ${selectLow}>低</option>
            </select>

            <button class="btn-delete-task" data-id="${task.taskid}">削除</button>
        </div>
        `;

        //作成したHTMLをtaskListの下に追加していく
        taskList.insertAdjacentHTML('beforeend', taskHtml);
    })

}

//2.新規登録
async function addTask() {
    let newTaskNameInput = document.getElementById("new-task-title");
    let newTaskPriorityInput = document.getElementById("new-task-priority");
    const newTaskName = newTaskNameInput.value;
    const newTaskPriority = parseInt(newTaskPriorityInput.value);

    // console.log(newTaskName);
    // console.log(newTaskPriority);

    if (newTaskName.trim() === "") {
        alert("タスク名が入力されていません。");
        return;
    }

    if (newTaskPriority < 1 || newTaskPriority > 3) {
        alert("優先度選択が不正です");
        return;
    }

    //新規作成POST用
    const requestData = {
        taskname: newTaskName,
        taskpriority: newTaskPriority
    };

    try {
        // C#のコントローラー（api/todos）にデータをちょうだいとリクエスト
        const response = await fetch('/api/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {

            console.log("新規登録に成功しました:");
            await fetchTasks();

        } else {

            if (response.status === 405) {
                console.error("リクエストの送信方式がサーバー側と一致していません。");
                alert("リクエストの送信方式がサーバー側と一致していません\nステータスコード: 405 " + response.statusText);
            }

            else if (response.status === 404) {
                console.error("リクエストしたURLが見つかりません。");
                alert("リクエストしたURLが見つかりません  :  " + response.url + "\nステータスコード: 404 " + response.statusText);
            }

            else if (response.status === 400) {
                console.error("不正なリクエストです（400）");

                const errorData = await response.json();
                const errorMsg = errorData.errors[0].message;

                if (errorMsg === "INVALID_REQUEST") {
                    alert("送信されたデータの形式（JSON）が正しくありません");
                }
                else if (errorMsg === "TITLE_IS_NULL") {
                    alert("タスク名が入力されていません");
                }
            }

            else {
                console.error("サーバーエラーが発生しました");
                alert("サーバーエラーが発生しました:\nステータスコード: " + response.status);
            }
        }
    } catch (error) {
        console.error("通信に失敗しました:", error);
        alert("通信に失敗しました:\n" + error.message);
    }
}

//3.タスク削除
async function deleteTask(taskId) {

    const requestData = {
        taskid: taskId
    };

    try {
        // C#のコントローラー（api/todos）にデータをちょうだいとリクエスト
        const response = await fetch('/api/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {

            console.log("削除に成功しました:");
            await fetchTasks();

        } else {

            if (response.status === 405) {
                console.error("リクエストの送信方式がサーバー側と一致していません。");
                alert("リクエストの送信方式がサーバー側と一致していません\nステータスコード: 405 " + response.statusText);
            }

            else if (response.status === 404) {
                console.error("リクエストしたURLが見つかりません。");
                alert("リクエストしたURLが見つかりません  :  " + response.url + "\nステータスコード: 404 " + response.statusText);
            }

            else if (response.status === 400) {
                console.error("不正なリクエストです（400）");

                const errorData = await response.json();
                const errorMsg = errorData.errors[0].message;

                if (errorMsg === "INVALID_REQUEST") {
                    alert("送信されたデータの形式（JSON）が正しくありません");
                }
                else if (errorMsg === "TASK_NOT_FOUND") {
                    alert("対象タスクが見つかりませんでした");
                }
            }

            else {
                console.error("サーバーエラーが発生しました");
                alert("サーバーエラーが発生しました:\nステータスコード: " + response.status);
            }
        }
    } catch (error) {
        console.error("通信に失敗しました:", error);
        alert("通信に失敗しました:\n" + error.message);
    }
}

//4.ステータス変更
async function updateTaskStatus(taskId, isChecked) {

    const requestData = {
        taskid: taskId,
        taskstatus: isChecked
    };


    try {
        // C#のコントローラー（api/todos）にデータをちょうだいとリクエスト
        const response = await fetch('/api/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });


        if (response.ok) {

            console.log("ステータス変更に成功しました:");
            await fetchTasks();

        } else {

            if (response.status === 405) {
                console.error("リクエストの送信方式がサーバー側と一致していません。");
                alert("リクエストの送信方式がサーバー側と一致していません\nステータスコード: 405 " + response.statusText);
            }

            else if (response.status === 404) {
                console.error("リクエストしたURLが見つかりません。");
                alert("リクエストしたURLが見つかりません  :  " + response.url + "\nステータスコード: 404 " + response.statusText);
            }

            else if (response.status === 400) {
                console.error("不正なリクエストです（400）");

                const errorData = await response.json();
                const errorMsg = errorData.errors[0].message;

                if (errorMsg === "INVALID_REQUEST") {
                    alert("送信されたデータの形式（JSON）が正しくありません");
                }
                else if (errorMsg === "TASK_NOT_FOUND") {
                    alert("対象タスクが見つかりませんでした");
                }
            }

            else {
                console.error("サーバーエラーが発生しました");
                alert("サーバーエラーが発生しました:\nステータスコード: " + response.status);
            }
        }
    } catch (error) {
        console.error("通信に失敗しました:", error);
        alert("通信に失敗しました:\n" + error.message);
    }
}

//5.優先度変更
async function updateTaskPriority(taskId, taskPriority) {

    const requestData = {
        taskid: taskId,
        taskpriority: taskPriority
    };

    try {
        // C#のコントローラー（api/todos）にデータをちょうだいとリクエスト
        const response = await fetch('/api/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {

            console.log("ステータス変更に成功しました:");
            await fetchTasks();

        } else {

            if (response.status === 405) {
                console.error("リクエストの送信方式がサーバー側と一致していません。");
                alert("リクエストの送信方式がサーバー側と一致していません\nステータスコード: 405 " + response.statusText);
            }

            else if (response.status === 404) {
                console.error("リクエストしたURLが見つかりません。");
                alert("リクエストしたURLが見つかりません  :  " + response.url + "\nステータスコード: 404 " + response.statusText);
            }

            else if (response.status === 400) {
                console.error("不正なリクエストです（400）");

                const errorData = await response.json();
                const errorMsg = errorData.errors[0].message;

                if (errorMsg === "INVALID_REQUEST") {
                    alert("送信されたデータの形式（JSON）が正しくありません");
                }
                else if (errorMsg === "TASK_NOT_FOUND") {
                    alert("対象タスクが見つかりませんでした");
                }
            }

            else {
                console.error("サーバーエラーが発生しました");
                alert("サーバーエラーが発生しました:\nステータスコード: " + response.status);
            }
        }
    } catch (error) {
        console.error("通信に失敗しました:", error);
        alert("通信に失敗しました:\n" + error.message);
    }
}