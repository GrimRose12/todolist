import './styles.css';
import {differenceInCalendarDays, isSameDay, isTomorrow, isSameWeek, isSameMonth, isPast} from 'date-fns'

class categories {
    constructor(name){
        this.name = name;
    }
}

class TodoItem {
    constructor(project='none', task, details ='', dueDate, priority = 'low') {
        this.project = project;
        this.task = task;
        this.details = details;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isComplete = false;
    }
}


function create() {
    // for the + button
}


function addItem() {
    
}

function deleteItem(){

}

function createCategory() {

}


// DOM

class Dropdown {
    constructor(){
        this.button = document.querySelector('.timeSelect');
        this.dropdown = document.querySelector('.timeDropdown');
        this.button.addEventListener('click', ()=> this.toggleDropdown());
        document.addEventListener('click', (event)=>this.closeDropdown(event));
        this.dropdownSelect();
    }

    toggleDropdown(){
        this.dropdown.classList.toggle('hidden');
    }

    closeDropdown(event){
        if (!this.dropdown.contains(event.target) && !this.button.contains(event.target)) {
            this.dropdown.classList.add('hidden');
          }
    }

    dropdownSelect() {

        const tabs = document.querySelectorAll('[data-tab-target]');
        const tabContents = document.querySelectorAll('[data-tab-content]');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.toggleDropdown();
                const target = document.querySelector(tab.dataset.tabTarget);
    
                tabContents.forEach(tabContent => {
                    tabContent.classList.remove('active');
                })
                
                target.classList.add('active');
            })
    
        })
    }
}

class addTasks {
    constructor(){
        this.modal = document.querySelector('.add-task-modal');
        this.button = document.querySelector('.add-tasks');
        this.button.addEventListener('click', () => {
            this.modal.removeAttribute('hidden');
        });
        document.addEventListener('click', (event) => {
            if (event.target == this.modal) {
                document.querySelector('.add-task-modal').setAttribute('hidden', true);
            }
        })
        this.form = document.querySelector('form.add-task');
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const project = document.getElementById('project').value;
            const task = document.getElementById('task').value;
            const details = document.getElementById('details').value;
            const dueDate = document.getElementById('due').value;
            const priority = document.getElementById('priority').value;
        
            const item = new TodoItem(project, task, details, dueDate, priority);
            items.push(item);
            console.log(items);
            document.dispatchEvent(updateHome.itemsChangeEvent);
            this.form.reset();
            
        })
    }
}

class updateContent {
    constructor(){
        this.itemsChangeEvent = new Event('itemsChange');
        document.addEventListener('itemsChange', function() {
            updateHome.createContent(items);
          });
    }

    createContent(items) {
        const filter = new filterTasks(items[items.length-1]);
        console.log(filter);
        updatePage(filter);

        function updatePage(filter) {
            const classifications = Object.getOwnPropertyNames(filterTasks.prototype).filter(prop => prop !== 'constructor' && typeof filter[prop] === 'function');
            classifications.forEach(updatePage);
            function updatePage(classification){
                
                // const div = document.createElement('div'); 
                // div.classList.add('task-item');
                const itemList = filter[classification](items)[0];
                if (itemList.length === 0) {
                    console.log('No items');
                    return;
                }
                filter[classification](items)[1].innerHTML = '';
                itemList.forEach((item) => {
                    const taskDiv = document.createElement('div');
                    taskDiv.innerHTML =`
                    <div>Project: ${item.project}</div>
                    <div>Task: ${item.task}</div>
                    <div>Details: ${item.details}</div>
                    <div>Due Date: ${item.dueDate}</div>
                    <div>Priority: ${item.priority}</div>
                    `;
                    filter[classification](items)[1].appendChild(taskDiv);
                })
                // const item = itemList[itemList.length-1];
                // const htmlCode = `
                // <div>Project: ${item.project}</div>
                // <div>Task: ${item.task}</div>
                // <div>Details: ${item.details}</div>
                // <div>Due Date: ${item.dueDate}</div>
                // <div>Priority: ${item.priority}</div>
                // `
                // div.innerHTML = htmlCode;
                // filter[classification](items)[1].innerHTML = '';
                // filter[classification](items)[1].appendChild(div);
            }
        }
    }
        
    
}

class filterTasks {
    constructor(items){
        this.items = items;
        this.currentDate = new Date();
    }

    filterAll(items){
        const div = document.querySelector('#all .items');
        return [items,div]
    }
    filterToday(items){
        const div = document.querySelector('#today .items');
        const result = items.filter((item) => isSameDay(new Date(item.dueDate), this.currentDate));
        return [result, div];
    }

    filterTomorrow(items){
        const div = document.querySelector('#tomorrow .items');
        const result = items.filter(item => isTomorrow(new Date(item.dueDate)));
        return [result, div];
    }

    filterWeek(items){
        const div = document.querySelector('#week .items');
        const result = items.filter(item => isSameWeek(new Date(item.dueDate), this.currentDate));
        return [result, div];
    }

    filterMonth(items){
        const div = document.querySelector('#month .items');
        const result = items.filter(item => isSameMonth(new Date(item.dueDate), this.currentDate));
        return [result, div];
    }
    filterOverdue(items){
        const div = document.querySelector('#overdue .items');
        const result = items.filter(item => isPast(new Date(item.dueDate)));
        return [result, div];
    }
}


let items = [];
const dropDown = new Dropdown();
const addTask = new addTasks;
const updateHome = new updateContent;

