const form = document.querySelector('.form');
const taskStorage = (localStorage.getItem('task') == null) ? [] : JSON.parse(localStorage.getItem('task'));
const taskList = document.querySelector('.tasklist');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskObject = {task: form.elements['task'].value, checked: false};
    taskStorage.push(taskObject);
    
    updateTask(taskObject, taskStorage, taskList);
    
    localStorage.setItem('task', JSON.stringify(taskStorage));

    setTimeout(cleanField, 100);
});

const cleanField = () => {
    form.elements['task'].value = '';
};

// how task has to appear on feed
const taskOnFeed = (index, array) => {
    let task = array[index].task;
    let taskContent = 
    `<div class="task-content">
        <div class="task-content-child">
            <input type="checkbox" id="task${index + 1}" name="task" value="task${index + 1}" onClick="markTask(this)">        
            <label for="task${index + 1}" class="task${index + 1}">${task}</label>
        </div>
        <button onclick="removeTask(this)" id="rmtask${index + 1}">x</button>
    </div>`;

    return taskContent;
};

// display the current tasks 
const showTasksOnLoad = (array) => {    
    for (let i = 0; i < array.length; i++) {
        taskList.insertAdjacentHTML('beforeend', taskOnFeed(i, array));
    };
};

// display the new task
const updateTask = (task, array, container) => {
    const index = array.length;
    const taskContent = 
    `<div class="task-content">
        <div class="task-content-child">
            <input type="checkbox" id="task${index - 1}" name="task" value="task${index - 1}" onClick="markTask(this)">        
            <label for="task${index - 1}" class="task${index - 1}">${task.task}</label>
        </div>
        <button onclick="removeTask(this)" id="rmtask${index - 1}">x</button>
    </div>`;

    container.insertAdjacentHTML('beforeend', taskContent);
};

// check the task
const markTask = (element) => {    
    let elementID = element.id;
    let respectiveLabel = document.querySelector(`.${elementID}`);
    let check = element.checked;
    let index = findObjectIndex(`${respectiveLabel.innerHTML}`);
    
    if (check) {
        respectiveLabel.style = 'text-decoration: line-through';
        taskStorage[index].checked = true;
    } else {
        respectiveLabel.style = 'text-decoration: none';
        taskStorage[index].checked = false;
    };

    localStorage.setItem('task', JSON.stringify(taskStorage));
};

const findObjectIndex = (value) => {
    for (let i = 0; i < taskStorage.length; i++) {
        if (taskStorage[i].task == value) {
            return i;
        };
    };
};

const mapChecked = (array) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].checked == true) {
            let element = document.querySelector(`#task${i + 1}`);            
            let respectiveLabel = document.querySelector(`.task${i + 1}`); 
            element.checked = true;
            respectiveLabel.style = 'text-decoration: line-through';            
        };
    };
};

const removeTask = (element) => {        
    if (window.confirm('Are you sure you want to remove the task?')) {
        let content = element.closest(".task-content");    
        let respectiveLabel = content.children[0].children[1];
        let index = findObjectIndex(respectiveLabel.innerHTML);    
        taskStorage.splice(index, 1);
        localStorage.setItem('task', JSON.stringify(taskStorage));
        document.location.reload(true);
    };
};



// load two functions when refresh page
window.onload = function onLoad() {
                    showTasksOnLoad(taskStorage);
                    mapChecked(taskStorage);
                }; 