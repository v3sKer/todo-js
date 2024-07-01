/*

  MAIN RENDER SECTION

*/

const tabDashboardBtn = document.querySelector('#dashboard-tab-btn');
const tabTasksBtn = document.querySelector("#tasks-tab-btn");
const tabProjBtn = document.querySelector("#proj-tab-btn");

const HTMLMainSection = document.querySelector('main');

function clearMain() {
  const currentBackendWrapper = document.querySelector('.backend-wrapper');
  if (currentBackendWrapper !== 'null') {currentBackendWrapper.remove};
};

tabTasksBtn.addEventListener('click', () => {
  clearMain();
  renderTasks();
});

function renderTasks() {
  const backendWrapper = document.createElement('div');
  backendWrapper.classList.add('backend-wrapper');
}

/*

  FORM RENDER SECTION

*/

const newTaskBtn = document.querySelector('#header-newtask-btn');
const newTaskModal = document.querySelector('#newtask-modal');
const newTaskModalCloseBtn = document.querySelector('#newtask-modal-closebtn');

newTaskBtn.addEventListener('click', () => {
  newTaskModal.showModal();
  clearFormInputs();
  getActiveFormTabBtn();
  populateActiveFormTab();
  populateTaskCategory();
});

function getActiveFormTab() {return document.querySelector('.form-cat-active').dataset.value};

function getActiveFormTabBtn() {
  const taskCategoryBtn = [...document.querySelectorAll('#cat-btn')];
  taskCategoryBtn.map(item => {item.classList.remove('form-cat-active')});
  taskCategoryBtn[0].classList.add('form-cat-active'); // Make task button enabled by default

  // Allow user to switch active form tab button
  taskCategoryBtn.map(item => {
    item.addEventListener('click', () => {
      taskCategoryBtn.map(item => {item.classList.remove('form-cat-active')});
      item.classList.add('form-cat-active');
      populateActiveFormTab();
    });
  });
}

function populateActiveFormTab() {
  [...document.querySelectorAll('.modal-form')].map(item => { 
    item.classList.add('modal-form-disabled'); // Make sure other forms are disabled
  }); 

  if (getActiveFormTab() === 'task') {
    enableForm('task');
  };

  if (getActiveFormTab() === 'proj') {enableForm('proj')};
};


function populateTaskCategory() {
  const previousTaskCategoryGroup = document.querySelector('#task-cat-group');
  if (previousTaskCategoryGroup !== null) {previousTaskCategoryGroup.remove()};
  
  if (userProjects.length !== 0) {
    const taskCategorySelect = document.querySelector('#task-category');

    const taskCategoryGroup = document.createElement('optgroup');
    taskCategoryGroup.setAttribute('id', 'task-cat-group');
    taskCategoryGroup.setAttribute('label', 'Projects');

    userProjects.map(item => {
      const taskCategoryItem = document.createElement('option');
      taskCategoryItem.textContent = item.name;
      taskCategoryItem.setAttribute('value', `${item.projID}`);

      taskCategoryGroup.appendChild(taskCategoryItem);
    });

    taskCategorySelect.appendChild(taskCategoryGroup);
  };
};

function enableForm(item) {
  const formWrapper = document.querySelector(`#${item}-form`);
  formWrapper.classList.remove('modal-form-disabled');
};

function clearFormInputs() {
  const clearedInputs = [...document.querySelectorAll('.clear-input')];
  clearedInputs.map(item => {item.value = ''});
};

document.querySelector('#modal-closebtn').addEventListener('click', () => {
  newTaskModal.close();
  clearFormInputs();
});

// Make sure ESC also clears modal forms on close
document.addEventListener('keydown', function(e) {
  if(e.key == 'Escape'){
    clearFormInputs();
  }
});

/*

  FORM VALIDATION

*/

let uniqueTaskID = 0;
let uniqueProjID = 0;

let userTasks = [];
let userProjects = [];

class Task {
  constructor(cat, title, priority, estimate, deadline, desc) {
    this.cat = cat;
    this.title = title;
    this.priority = priority;
    this.estimate = estimate;
    this.deadline = deadline;
    this.desc = desc;

    this.taskID = uniqueTaskID++;
  };
};

class Proj {
  constructor(name, repo, deadline, desc) {
    this.name = name;
    this.repo = repo;
    this.deadline = deadline;
    this.desc = desc;

    this.tasks = [];
    this.projID = uniqueProjID++;
  };
};

// localStorage.setItem shorthand
function writeData(localStorageItem, data) {
  localStorage.setItem(localStorageItem, JSON.stringify(data));
}

function getStoredData() {
  userTasks = parseData('storedUserTasks');
  userProjects = parseData('storedUserProjects');
  uniqueTaskID = parseData('storedUniqueTaskID');
  uniqueProjID = parseData('storedUniqueProjID');
};

getStoredData();

// localStorage.getItem validation shorthand
function parseData(localStorageItem) {
  if (typeof localStorage.getItem(localStorageItem) !== 'undefinde'){
    let output = JSON.parse(localStorage.getItem(localStorageItem));
    console.log(`succesfull retrieve ${localStorageItem}`)
    console.log(output);

    return output;
  };
};

function setStoredData() {
  writeData('storedUserTasks', userTasks);
  writeData('storedUserProjects', userProjects);
  writeData('storedUniqueTaskID', uniqueTaskID);
  writeData('storedUniqueProjID', uniqueProjID);
};

function resetStoredData() {
  writeData('storedUserTasks', []);
  writeData('storedUserProjects', []);
  writeData('storedUniqueTaskID', 0);
  writeData('storedUniqueProjID', 0);
};

function clearErrors() {
  const errorsDisplay = document.querySelector('.form-errors');
  errorsDisplay.textContent = '';
}

// Actual form validation
const modalForms = [...document.querySelectorAll('#modal-form')];
modalForms.map(item => {
  item.addEventListener('submit', (e) => {
    e.preventDefault();

    if(item.dataset.value === 'task') {
      const catInput = document.querySelector('#task-category').value;
      const priorityInput = document.querySelector('#task-priority').value;
      const titleInput = document.querySelector('#task-title').value;
      const estimateInput = document.querySelector('#task-time').value;
      const deadlineInput = document.querySelector('#task-deadline').value;
      const descInput = document.querySelector('#task-desc').value;

      const deadlineInputValiDate = new Date(deadlineInput);
      const todaysValiDate = new Date();

      if (deadlineInputValiDate < todaysValiDate) {
        e.preventDefault();
        const errorsDisplay = document.querySelector('.form-errors');
        errorsDisplay.textContent = `* Can't create task with deadline in the past!`;
        deadlineInput.value = '';
        return;
      }

      const newItem = new Task(
        catInput,
        priorityInput,
        titleInput,
        deadlineInput,
        descInput,
      );

      userTasks.push(newItem);
      console.log(`created ${item.dataset.value}`);

      if (newItem.cat !== 'individual') {
        userProjects[newItem.cat].tasks.push(newItem.taskID);
      };
    };

    if (item.dataset.value === 'proj') {
      const nameInput = document.querySelector('#proj-name').value;
      const repoInput = document.querySelector('#proj-repo').value;
      const deadlineInput = document.querySelector('#proj-deadline').value;
      const descInput = document.querySelector('#proj-desc').value;

      // Actual actual form validation
      const deadlineInputValiDate = new Date(deadlineInput);
      const todaysValiDate = new Date();

      if (deadlineInputValiDate < todaysValiDate) {
        e.preventDefault();
        const errorsDisplay = document.querySelector('.form-errors');
        errorsDisplay.textContent = `* Can't create project with deadline in the past!`;
        deadlineInput.value = '';
        return;
      }

      const newItem = new Proj(
        nameInput,
        repoInput,
        deadlineInput,  
        descInput
      );
      userProjects.push(newItem);
    };

    setStoredData();

    newTaskModal.close();
    clearErrors();
    clearFormInputs();
  });
});
