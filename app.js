const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const formInput = document.querySelector("#todo-form input");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

if (localStorage.getItem('tasks')) {
    tasks.map((task) => {
        createTask(task)
    })
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = formInput.value;
    // console.log(inputValue);

    if (inputValue == "") {
        return;
    }

    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false
    }
    // console.log(task);
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    createTask(task);

    todoForm.reset();
    formInput.focus();
});

todoList.addEventListener("click", (e) => {
    // console.log('click');
    if (e.target.classList.contains('remove-task') ||
        e.target.parentElement.classList.contains('remove-task') ||
        e.target.parentElement.parentElement.classList.contains('remove-task')) {
        const taskId = e.target.closest('li').id;
        console.log(taskId);

        removeTask(taskId);
    }

    // console.log(e.target.classList.contain('remove-task'));
    // console.log(e.target.closest('li').id);
})

todoList.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();

        e.target.blur();
    }
})

todoList.addEventListener('input', (e) => {
    const taskId = e.target.closest('li').id;

    updateTask(taskId, e.target)
})


function createTask(task) {
    const taskEl = document.createElement('li');
    taskEl.classList.add('flex');
    taskEl.setAttribute('id', task.id);

    if (task.isCompleted) {
        taskEl.classList.add('complete')
    }

    const taskElMarkup = `
                    <div class="flex">
                        <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
                        <span ${!task.isCompleted ? 'contenteditable' : 'true'}>${task.name}</span>
                    </div>

                    <button title="Remove the ${task.name} task" class="remove-task">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="none" stroke="#001c30" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M12 12L6 6m6 6l6 6m-6-6l6-6m-6 6l-6 6" />
                        </svg>
                    </button>`

    countTasks();

    taskEl.innerHTML = taskElMarkup;
    todoList.appendChild(taskEl);
}

function countTasks() {
    const completedTasksArray = tasks.filter((task) => task.isCompleted === true);

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completedTasksArray.length;
    remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

function removeTask(taskId) {
    tasks = tasks.filter((task) => task.id != parseInt(taskId));

    localStorage.setItem('tasks', JSON.stringify(tasks))

    document.getElementById(taskId).remove();

    countTasks();
}

function updateTask(taskId, el) {
    const task = tasks.find((task) => task.id === parseInt(taskId))

    if (el.hasAttribute('contenteditable')) {
        task.name = el.textContent;
    } else {
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted;

        if (task.isCompleted) {
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        } else {
            span.setAttribute('contenteditable');
            parent.classList.remove('complete');
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));

    countTasks();
}
