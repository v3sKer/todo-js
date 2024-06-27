const tabTasksBtn = document.querySelector("#tasks-tab-btn");
const tabProjBtn = document.querySelector("#proj-tab-btn");

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
  }) 

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
  constructor(cat, level, name, datetime, desc) {
    this.cat = cat;
    this.level = level;
    this.name = name;
    this.datetime = datetime;
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

function getStoredData() {
  if (typeof localStorage.storedUserTasks !== 'undefined') {
    userTasks = JSON.parse(localStorage.storedUserTasks);
    console.log('succesfull retrieve tasks');
    console.log(userTasks);
  };

  if(typeof localStorage.storedUserProjects !== 'undefined') {
    userProjects = JSON.parse(localStorage.storedUserProjects);
    console.log('succesfull retrieve projs');
    console.log(userProjects);
  };

  if (typeof localStorage.storedUniqueTaskID !== 'undefined') {
    uniqueTaskID = JSON.parse(localStorage.storedUniqueTaskID);
    console.log('succesfull retrieve unique taskid');
    console.log(uniqueTaskID);
  };

  if (typeof localStorage.storedUniqueProjID !== 'undefined') {
    uniqueProjID = JSON.parse(localStorage.storedUniqueProjID);
    console.log('succesfull retrieve unique projid');
    console.log(uniqueProjID);
  };
};

getStoredData();

// localStorage.setItem shorthand
function writeData(localStorageItem, data) {
  localStorage.setItem(localStorageItem, JSON.stringify(data));
}

function setStoredData() {
  writeData('storedUserTasks', userTasks);
  writeData('storedUserProjects', userProjects);
  writeData('storedUniqueTaskID', uniqueTaskID);
  writeData('storedUniqueProjID', uniqueProjID);
}

function resetStoredData() {
  writeData('storedUserTasks', []);
  writeData('storedUserProjects', []);
  writeData('storedUniqueTaskID', 0);
  writeData('storedUniqueProjID', 0);
}

// Actual form validation
const modalForms = [...document.querySelectorAll('#modal-form')];
modalForms.map(item => {
  item.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(`created ${item.dataset.value}`);

    if(item.dataset.value === 'task') {
      const catInput = document.querySelector('#task-category').value;
      const levelInput = document.querySelector('#task-level').value;
      const nameInput = document.querySelector('#task-name').value;
      const datetimeInput = document.querySelector('#task-datetime').value;
      const descInput = document.querySelector('#task-desc').value;

      const newItem = new Task(
        catInput,
        levelInput,
        nameInput,
        datetimeInput,
        descInput,
      );

      userTasks.push(newItem);

      if (newItem.cat !== 'individual') {
        userProjects[newItem.cat].tasks.push(newItem.taskID);
      }
    };

    if (item.dataset.value === 'proj') {
      const nameInput = document.querySelector('#proj-name').value;
      const repoInput = document.querySelector('#proj-repo').value;
      const deadlineInput = document.querySelector('#proj-deadline').value;
      const descInput = document.querySelector('#proj-desc').value;

      const newItem = new Proj(
        nameInput,
        repoInput,
        deadlineInput,  
        descInput
      )

      userProjects.push(newItem);
    }

    setStoredData();

    newTaskModal.close();
    clearFormInputs();
  });
});
