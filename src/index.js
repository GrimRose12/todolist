import './styles.css';
import {isSameDay, isTomorrow, isSameWeek, isSameMonth, isSameYear, isPast} from 'date-fns';

class TaskItem {
    constructor(project, task, details, dueDate, priority){
        this.project = project;
        this.task = task;
        this.details = details;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isDone = false;
        this.isShown = false;
    }
}

class Render {
    constructor(taskList, projects){
        this.taskList = taskList;
        this.projects = projects;
        this.content = contentByPeriod(this.taskList);
        displayContent(this.taskList);
        contentByProject(this.projects, this.taskList);
        home(this.taskList, this.content);
        addTaskButton(this.taskList, this.content);
    }
}


if(!localStorage.getItem('taskList')){
    populateStorage()
} else {
    setItems();
}

function populateStorage(){
    localStorage.setItem('taskList', JSON.stringify([]));
    localStorage.setItem('projects', JSON.stringify([]));
}

function setItems(){
    const tasks = JSON.parse(localStorage.getItem('taskList'));
    const projects = JSON.parse(localStorage.getItem('projects'));
    const render = new Render(tasks, projects);
}   

// const render = new Render();

function contentByPeriod(tasks) {
    const periodList = document.querySelector('.period-list');
    const periods = document.querySelectorAll('.period-list-item');
    const selectPeriodDiv = document.querySelector('.select-period');
    const mainContentHeader = document.querySelector('.main-content-header');
    let selectedPeriod = 'all';

    function dropdown() {
        function selectPeriod() {
            periods.forEach(period => {
                period.addEventListener('click', () => {
                    selectedPeriod = period.id;
                    selectPeriodDiv.textContent = period.textContent;
                    periodList.classList.add('hidden');
                    mainContentHeader.textContent = period.textContent;
                    updateContent();
                })
            })
        };
        selectPeriod();
        function openPeriodList() {
            selectPeriodDiv.addEventListener('click', () => {
                periodList.classList.toggle('hidden');
            })
        };
        openPeriodList();

        function closeDropdown(event){
            if (!periodList.contains(event.target) && !selectPeriodDiv.contains(event.target)) {
                periodList.classList.add('hidden');
              }
        }
        document.addEventListener('click', (event)=>closeDropdown(event));

    };
    dropdown()

 
    function filterByPeriod(tasks) {
        // All, today, tomorrow, week, month, year, overdue
        function all() {
            return tasks;
        };

        function today() {
            return tasks.filter(task => isSameDay(new Date(task.dueDate), new Date()));
        };

        function tomorrow() {
            return tasks.filter(task => isTomorrow(new Date(task.dueDate)));
        };

        function week() {
            return tasks.filter(task => isSameWeek(new Date(task.dueDate), new Date()));
        };

        function month() {
            return tasks.filter(task => isSameMonth(new Date(task.dueDate), new Date()));
        };

        function year() {
            return tasks.filter(task => isSameYear(new Date(task.dueDate), new Date()));
        };

        function overdue() {
            return tasks.filter(task => isPast(new Date(task.dueDate)));
        };

        return {all, today, tomorrow, week, month, year, overdue}
    }
    function updateContent() {
        const filteredTasks = filterByPeriod(tasks)[selectedPeriod]();
        tasks.forEach(task => {
            if (filteredTasks.includes(task)) {
                task.isShown = true;
            } else {
                task.isShown = false;
            }
        });
        displayContent(tasks);
    }

    return { updateContent, filterByPeriod };
}

function contentByProject(projects, tasks){
    const selectPeriodDiv = document.querySelector('.select-period');

    
    function addNewProject(){
        const newProject = document.getElementById('new-project');
        newProject.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const project = newProject.value;
                projects.push(project);
                localStorage.setItem('projects', JSON.stringify(projects));
                newProject.value = '';
                createProjectOptions();
                projectTabs();
              }
        })
    };
    addNewProject();

    function projectTabs() {
        const projectList = document.querySelector('.project-list');
        const mainContentHeader = document.querySelector('.main-content-header');
    
        function generateProjectTabs() { 
            projectList.innerHTML = '';
            projects.forEach((project) => {
                const projectItem = document.createElement('li');
                projectItem.classList.add('project-list-item');
              
                const projectItemDiv = document.createElement('div');
                projectItemDiv.classList.add('project-list-item-div');
                projectItemDiv.textContent = project;

                const deleteProject = document.createElement('button');
                deleteProject.textContent = 'X';
                deleteProject.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const index = projects.findIndex((projectitem) => projectitem === project);
                    if (index > -1) {
                        projects.splice(index, 1);
                    }
                    projectItem.remove();
                    createProjectOptions();
                    tasks.splice(0, tasks.length, ...tasks.filter((task) => task.project !== project));
                    displayContent(tasks);
                 
                });
                projectItem.appendChild(projectItemDiv);
                projectItem.appendChild(deleteProject);
                projectList.appendChild(projectItem);
            })
        };
        generateProjectTabs()
        
        function projectTabsClickEvent() {
            const projectListItems = document.querySelectorAll('.project-list-item-div');
            projectListItems.forEach(projectItem => {
                projectItem.addEventListener('click', () =>{
                    mainContentHeader.textContent = projectItem.textContent;
                    // insert isShown reset here
                    filterByProject(projectItem);
                    selectPeriodDiv.textContent = 'All';
    
                })
            })
        };
        projectTabsClickEvent();
        function filterByProject(projectItem) {
            tasks.forEach(task => {
                if(task.project === projectItem.textContent) {
                    task.isShown = true;
                } else {
                    task.isShown = false;
                }
            })
            displayContent(tasks);
        }
    };
    projectTabs();
    function createProjectOptions(){
        const projectList = document.getElementById('project')
        projectList.innerHTML = '<option value="None">None</option>';
        projects.forEach((project) => {
            const option = document.createElement('option');
            option.textContent = project;
            option.setAttribute('value', project);
            projectList.appendChild(option);
        })
    };
    createProjectOptions();
}




function displayContent(tasks) {
    const contentDiv = document.querySelector('.main-content');
    contentDiv.innerHTML = '';
    tasks.forEach((task) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-div');
        taskDiv.innerHTML = `
        <button class="task-complete" type="button">✓</button>
        <button class="task-delete" type="button">X</button>
        <div>Project: ${task.project}</div>
        <div>Task: ${task.task}</div>
        <div>Details: ${task.details}</div>
        <div>Due Date: ${task.dueDate}</div>
        <div>Priority: ${task.priority}</div>
        `;
        if(task.isShown === false) {
            taskDiv.setAttribute('hidden', '');
        }
        else if(task.isShown === true){
            taskDiv.removeAttribute('hidden');
        }
        contentDiv.appendChild(taskDiv);

        const deleteButton = taskDiv.querySelector('.task-delete');
        deleteButton.addEventListener('click', () => {
            const index = tasks.findIndex((taskItem) => taskItem === task);
            if (index > -1) {
                tasks.splice(index, 1);
                displayContent(tasks);
            }
        })
    })
}




function addTaskButton(taskList, content){
    const button = document.querySelector('.add-task-button');
    button.addEventListener('click', () => {
        document.querySelector('.add-task-modal').removeAttribute('hidden');
    })
    addTaskForm(taskList, content);
};

function addTaskForm(taskList, content){
    const formModal = document.querySelector('.add-task-modal');
    const form = document.querySelector('.add-task');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formModal.setAttribute('hidden', true);
        const project = document.getElementById('project').value;
        const task = document.getElementById('task').value;
        const details = document.getElementById('details').value;
        const dueDate = document.getElementById('due').value;
        const priority = document.getElementById('priority').value;
        const item = new TaskItem(project, task, details, dueDate, priority)
        taskList.push(item);
        localStorage.setItem('taskList', JSON.stringify(taskList));
        content.updateContent();
        document.getElementById('task').value = '';
        document.getElementById('details').value = '';
    })

    document.addEventListener('click', (event) => {
        if (event.target == formModal) {
            closeModal();
        }
    })

    const closeModalButton = document.querySelector('.closeModal');
    closeModalButton.addEventListener('click', () => {
        closeModal();
    })

    function closeModal(){
        formModal.setAttribute('hidden', true);
    };
}


function home(taskList, content) {
    const homeTab = document.querySelector('.home');
    const mainContent = document.querySelector('.main-content');
    const mainContentHeader = document.querySelector('.main-content-header');
    homeTab.addEventListener('click', homeContent);

    function homeContent() {
        const allTasks = content.filterByPeriod(taskList).all().length;
        const todayTasks = content.filterByPeriod(taskList).today().length;
        const tomorrowTasks = content.filterByPeriod(taskList).tomorrow().length;
        const weekTasks = content.filterByPeriod(taskList).week().length;
        const monthTasks = content.filterByPeriod(taskList).month().length;
        const yearTasks = content.filterByPeriod(taskList).year().length;
        const overdueTasks = content.filterByPeriod(taskList).overdue().length;

        mainContent.innerHTML = '';
        mainContentHeader.textContent = 'Home';
        mainContent.innerHTML = `
       
        You have ${allTasks} unfinished ${allTasks <= 1 ? 'task' : 'tasks'}.<br>
        ${todayTasks} ${todayTasks <= 1 ? 'is' : 'are'} due today.<br>
        ${tomorrowTasks} ${tomorrowTasks <= 1 ? 'is' : 'are'} due tomorrow.<br>
        ${weekTasks} ${weekTasks <= 1 ? 'is' : 'are'} due this week.<br>
        ${monthTasks} ${monthTasks <= 1 ? 'is' : 'are'} due this month.<br>
        ${yearTasks} ${yearTasks <= 1 ? 'is' : 'are'} due this year.<br>
        ${overdueTasks} ${overdueTasks <= 1 ? 'is' : 'are'} overdue.
        `
    }
    homeContent();
}

