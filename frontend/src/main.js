import './style.css';
import './app.css';
import * as App from '../wailsjs/go/main/App';
//const App = require('../../wailsjs/go/main/App');



document.querySelector('#app').innerHTML = `
      <div class="result" id="result">Your To Do List</div>
      <div class="input-box" id="input">
        <input class="input" id="INput" type="text" autocomplete="off" placeholder="Your Task" />
        <input class="input" id="Date" type="date" autocomplete="off">
        <select id="SElect">
            <option valu="Low">Low</option>
            <option value="Meduim">Mid</option>
            <option value= "High">High</option>
        </select>
        <button class="btn" id="Button" >AddTask</button>
      </div>
      <div id="Pop-up" class="Pop-up">Please Enter Task can not be empty
      </div>
      <div id ="conf" class="conf">
        <div class="conf-content">
            <p> Are you sure?</p>
            <button id="YES">YES</button>
            <button id="NO">NO </button>
        </div>
      </div>
      <section>
        <p id='count'> This is your currently done tasks 0</p>

        <h1> Your active tasks </h1>
        <ul  class="new-class" id="task-list">
        </ul>
      </section>
      <section>

        <h2>Completed Tasks</h2>
        <ul class="complet" id="complited">
        </ul>
      </section>
`;
let taskDelete=null;
let taskINput= document.getElementById('INput');
document.getElementById('INput').addEventListener('keypress',EventListener)
document.getElementById('Button').addEventListener('click',EventListener)
window.onload=LoadTasks
function EventListener(event){
    if (event.type==='click' || (event.type==='keypress' && event.key==='Enter')) {
        let dueData=document.getElementById('Date').value;
        let priority=document.getElementById('SElect').value
        if (taskINput.value.trim()==='') {
            showAlert();
            return 0;
        }else{
            App.AddTask(taskINput.value,dueData,priority).then(()=>{
                LoadTasks();
            })
            taskINput.value='';
            document.getElementById("Date").value='';
            taskINput.focus()
        }
    }
}
function showDeleteConfi(id){
    taskDelete=id;
    document.getElementById('conf').style.display='block';
}
document.getElementById("YES").addEventListener('click',function(){
    if(taskDelete!==null){
        deleteTask(taskDelete).then(()=>{
            LoadTasks();
            hideDeleteConf();
        })
    }
})
document.getElementById("NO").addEventListener('click',hideDeleteConf)
function hideDeleteConf(){
    document.getElementById('conf').style.display='none';
    taskDelete=null;
}
// function saveTask(){
//     let tasks=[];
//     document.querySelectorAll('.list-item').forEach(element => {
//         tasks.push({
//             text: element.childNodes[1].nodeValue,
//             done: element.querySelector('.checker').checked
//         })
//     });
//     localStorage.setItem('tasks',JSON.stringify(tasks))
// }
// function LoadTasks(){
//     let tasks = JSON.parse(localStorage.getItem("tasks")) || []
//     tasks.forEach(task => {
//         AddTask(task.text);
//         if(task.done){
//             document.querySelector('.list-item:last-child.checker').checked=true;
//             document.querySelector('.list-item:last-child').classList.add('done');
//         }
        
//     });
// }
function LoadTasks(){
    App.GetTasks().then(tasks=>{
        console.log("Tasks:",tasks)
        let taskList=document.getElementById('task-list')
        let compli=document.getElementById('complited')
        taskList.innerHTML='';
        compli.innerHTML='';
        let num=0;
        tasks.forEach(task => {
            if(task.done){
                AddTaskToUi(task,compli);
                num++
            }else{
                AddTaskToUi(task,taskList)
            }
        });
        updateCount(num);
    })
}
function showAlert(){
    let alrt=document.getElementById('Pop-up')
    alrt.classList.add('show');
    setTimeout(()=>alrt.classList.remove('show'),2000);
}
// function AddTask(taskINput){
//     let taskList=document.getElementById('task-list');
//     if (!taskINput.trim()) {
//         showAlert("Task can`t be empty");
//         return;
//     }
function deleteTask(id){
    return App.DeleteTask(parseInt(id));
}
function AddTaskToUi(task,ListOne){
    let newLi=document.createElement('li');
    newLi.dataset.id=task.id;
    newLi.classList.add('list-item')
    let newChecker=document.createElement('input')
    newChecker.type='checkbox';
    newChecker.classList.add('checker');
    if(task.done){
        newLi.classList.add('done');
        newChecker.checked=true;
    }
    newChecker.addEventListener('change',function () {
        App.ToggleTask(task.id).then(()=>{
            LoadTasks();
        });
    })
    let newDelete=document.createElement('button');
    newDelete.classList.add('delete-bn');

    newDelete.addEventListener('click',function (){
        showDeleteConfi(task.id);
    })
    let addInfo=document.createElement('span');
    addInfo.classList.add('add-info');
    addInfo.innerText=`Due: ${task.data}, Priority: ${task.priority}`;
    newLi.appendChild(newChecker);
    newLi.appendChild(document.createTextNode(task.text));
    newLi.appendChild(newDelete);
    newLi.appendChild(addInfo);
    ListOne.appendChild(newLi);
}
function updateCount(num){
    document.getElementById('count').innerText=`This is your currently done tasks ${num}`
}