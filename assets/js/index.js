// INIT GLOBAL VARIABLES

let userTasks, userProjects, uniqueTaskID, uniqueProjID;

/*

  TABS SECTION

*/

const HTMLMainSection = document.querySelector('main');

const tabButtons = [...document.querySelectorAll('#tab-btn')];
tabButtons[0].classList.add('tab-active');
populateBackendWrapper();

tabButtons.map(item => {
  item.addEventListener('click', () => {
    setActiveTabButton(item);
    populateBackendWrapper();
  });
});

function setActiveTabButton(button) {
  const activatedTabBtn = document.querySelector('.tab-active');
  if (activatedTabBtn !== null) {activatedTabBtn.classList.remove('tab-active')};
  button.classList.add('tab-active'); 
};

function getActiveTabButton() {return document.querySelector('.tab-active').dataset.value}

function clearBackendWrapper() {
  const currentBackendWrapper = document.querySelector('.backend-wrapper');
  if (currentBackendWrapper !== null) {currentBackendWrapper.remove()};
};

function populateBackendWrapper() {
  clearBackendWrapper();
  const activeTab = getActiveTabButton();
  const mainSection = document.querySelector('main');
  const backendWrapper = document.createElement('div');
  backendWrapper.classList.add('backend-wrapper');

  if (activeTab === 'dashboard'){
    const backendHeader = document.createElement('h3');
    backendHeader.textContent = 'Dashboard';
    backendWrapper.appendChild(backendHeader);

    const text = document.createElement('p');
    text.classList.add('backend-wrapper-nodata');
    text.textContent = `Work in progress.`;
    backendWrapper.appendChild(text);
  };

  if (activeTab === 'tasks') {
    const backendHeader = document.createElement('h3');
    backendHeader.textContent = 'Tasks';
    backendWrapper.appendChild(backendHeader);

    if (userTasks.length === 0) {
      alertNoData(activeTab);
    };
    
    if (userTasks.length > 0) {
      const table = document.createElement('table');
      table.setAttribute('id', 'task-table');

      // THEAD
      const thead = document.createElement('thead');
      const theadRow = document.createElement('tr');
      const theadCells = ['', 'TITLE', 'STATUS', 'PRIORITY', 'ESTIMATE', 'DEADLINE'];
      theadCells.map(item => {
        const th = document.createElement('th');
        th.textContent = item;
  
        theadRow.appendChild(th);
      });
      thead.append(theadRow);

      // TBODY
      const tbody = document.createElement('tbody');
      userTasks.map(item => {
        let i = 1;

        if (item.cat === 'individual') {
          const trow = document.createElement('tr');
          
          const tdNum = document.createElement('td');
          tdNum.textContent = i++;
          trow.appendChild(tdNum);

          const tdTitle = document.createElement('td');
          tdTitle.innerHTML = `<i class='bx bx-chevron-right'></i>${item.title}`
          trow.appendChild(tdTitle);

          const tdStatus = document.createElement('td');
          const tdStatusPara = document.createElement('p');
          tdStatusPara.classList.add('task-status-start');
          tdStatusPara.textContent = 'Not started';
          tdStatus.appendChild(tdStatusPara);
          trow.appendChild(tdStatus);

          const tdPriority = document.createElement('td');
          const tdPriorityPara = document.createElement('p');
          const taskPriority = item.priority;
          tdPriorityPara.classList.add(`task-priority-${taskPriority}`);
          tdPriorityPara.textContent = taskPriority.charAt(0).toUpperCase() + taskPriority.slice(1);
          tdPriority.appendChild(tdPriorityPara);
          trow.appendChild(tdPriority);

          const tdEstimate = document.createElement('td');
          tdEstimate.textContent = item.estimate;
          trow.appendChild(tdEstimate);

          const tdDeadline = document.createElement('td');
          const validatedDealine = new Date(item.deadline);
          const months = ["January", "February", "March", "April", "May", "June", "July", "August", 
            "September", "October", "November", "December"];
          tdDeadline.textContent = `${validatedDealine.getDay()} ${months[validatedDealine.getMonth()]}, ${validatedDealine.getFullYear()}`;
          trow.appendChild(tdDeadline);

          tbody.appendChild(trow);
        };
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      backendWrapper.appendChild(table);
    };
  };

  if (activeTab === 'projects') {
    const backendHeader = document.createElement('h3');
    backendHeader.textContent = 'Projects';
    backendWrapper.appendChild(backendHeader);

    if (userProjects.length === 0) {alertNoData(activeTab)};

    if (userProjects.length > 0) {
      const table = document.createElement('table');
      table.setAttribute('id', 'proj-table');

      // THEAD
      const thead = document.createElement('thead');
      const theadRow = document.createElement('tr');
      const theadCells = ['', 'PROJECT NAME', 'PRIORITY', 'STATUS', 'REPOSITORY', 'DEADLINE'];
      theadCells.map(item => {
        const th = document.createElement('th');
        th.textContent = item;
  
        theadRow.appendChild(th);
      });
      thead.append(theadRow);

      // TBODY
      const tbody = document.createElement('tbody');
      userProjects.map(item => {
        const trow = document.createElement('tr');
        let i = 1;
        
        const tdNum = document.createElement('td');
        tdNum.textContent = i++;
        trow.appendChild(tdNum);

        const tdTitle = document.createElement('td');
        tdTitle.innerHTML = `<i class='bx bx-chevron-right'></i>${item.name}`
        trow.appendChild(tdTitle);

        
        const tdPriority = document.createElement('td');
        const tdPriorityPara = document.createElement('p');
        const projPriority = item.priority;
        tdPriorityPara.classList.add(`proj-priority-${projPriority}`);
        tdPriorityPara.textContent = projPriority.charAt(0).toUpperCase() + projPriority.slice(1);
        tdPriority.appendChild(tdPriorityPara);
        trow.appendChild(tdPriority);

        const tdStatus = document.createElement('td');
        const tdStatusPara = document.createElement('p');
        tdStatusPara.classList.add('proj-status-notstarted');
        tdStatusPara.textContent = 'Not started';
        tdStatus.appendChild(tdStatusPara);
        trow.appendChild(tdStatus);
        
        const tdRepo = document.createElement('td');
        if (item.repo.length > 0) {
          const tdRepoLink = document.createElement('a');
          tdRepoLink.classList.add('proj-repo');
          tdRepoLink.href = item.repo;
          tdRepoLink.setAttribute('target', '_blank');
          tdRepoLink.textContent = 'Link';
          tdRepo.appendChild(tdRepoLink);
        } else {
          const tdRepoPara = document.createElement('p');
          tdRepoPara.classList.add('proj-no-repo');
          tdRepoPara.textContent = 'No repository.'
          tdRepo.appendChild(tdRepoPara);
        }
        trow.appendChild(tdRepo);

        const tdDeadline = document.createElement('td');
        const validatedDealine = new Date(item.deadline);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", 
          "September", "October", "November", "December"];
        tdDeadline.textContent = `${validatedDealine.getDay()} ${months[validatedDealine.getMonth()]}, ${validatedDealine.getFullYear()}`;
        trow.appendChild(tdDeadline);

        tbody.appendChild(trow);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      backendWrapper.appendChild(table);
    };
  };

  function alertNoData(tab) {
    const text = document.createElement('p');
    text.classList.add('backend-wrapper-nodata');
    text.textContent = `You don't have any ${tab}.`;
    backendWrapper.appendChild(text);
  };

  mainSection.appendChild(backendWrapper);
};

/*

  TOOLS SECTION

*/

function craeteConfirmationDialog(context) {
  const HTMLbody = document.body;
  const modal = document.createElement('dialog');
  modal.setAttribute('id', 'confirm-modal');

  const modalHeaderWrapper = document.createElement('div');
  modalHeaderWrapper.classList.add('modal-header');

  const modalHeaderH3 = document.createElement('h3');
  modalHeaderH3.textContent = 'Confirm';

  const modalHeaderCloseBtn = document.createElement('i');
  modalHeaderCloseBtn.classList.add('bx', 'bx-x');
  modalHeaderCloseBtn.addEventListener('click', () => {
    modal.remove();
  });

  const modalContentWrapper = document.createElement('div');
  modalContentWrapper.classList.add('modal-content');

  if (context === 'deleteall') {
    const modalHeaderPara = document.createElement('p');
    modalHeaderPara.textContent = 'Do you really want to delete all tasks/projects?';
    
    modalContentWrapper.appendChild(modalHeaderPara);

    const modalContentButtonsWrapper = document.createElement('div');
    modalContentButtonsWrapper.classList.add('modal-content-buttons');

    const cancelButton = document.createElement('button');
    cancelButton.setAttribute('id', 'modal-cancel-btn');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => modal.remove());

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.addEventListener('click', () => {
      resetStoredData();
      location.reload();
    });

    modalContentButtonsWrapper.appendChild(cancelButton);
    modalContentButtonsWrapper.appendChild(confirmButton);
    modalContentWrapper.appendChild(modalContentButtonsWrapper);
  };


  
  modalHeaderWrapper.appendChild(modalHeaderH3);
  modalHeaderWrapper.appendChild(modalHeaderCloseBtn);
  modal.appendChild(modalHeaderWrapper);
  modal.appendChild(modalContentWrapper);
  HTMLbody.appendChild(modal);

  modal.showModal();
};

const deleteAllBtn = document.querySelector('#tools-deleteall-btn');
deleteAllBtn.addEventListener('click', () => {
  craeteConfirmationDialog('deleteall');
});

/*

  FORM SECTION

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
};

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

/*

  FORM VALIDATION

*/

// localStorage.setItem shorthand
function writeData(localStorageItem, data) {
  localStorage.setItem(localStorageItem, JSON.stringify(data));
}

function getStoredData() {
  userTasks = parseData('storedUserTasks', []);
  userProjects = parseData('storedUserProjects', []);
  uniqueTaskID = parseData('storedUniqueTaskID', 0);
  uniqueProjID = parseData('storedUniqueProjID', 0);
};

getStoredData();

// localStorage.getItem validation shorthand
function parseData(localStorageItem, defaultValue) {
  let output = localStorage.getItem(localStorageItem);

  if (output !== null){
    console.log(`succesfull retrieve ${localStorageItem}`)
    console.log(JSON.parse(output));
    return JSON.parse(output);
  };

  return defaultValue;
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
};

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
  constructor(name, priority, repo, deadline, desc) {
    this.name = name;
    this.priority = priority;
    this.repo = repo;
    this.deadline = deadline;
    this.desc = desc;

    this.tasks = [];
    this.projID = uniqueProjID++;
  };
};

// Actual form validation
const modalForms = [...document.querySelectorAll('#modal-form')];
modalForms.map(item => {
  item.addEventListener('submit', (e) => {
    e.preventDefault();

    if(item.dataset.value === 'task') {
      const cat = document.querySelector('#task-category').value;
      const title = document.querySelector('#task-title').value;
      const priority = document.querySelector('#task-priority').value;
      const estimate = function() {
        let estimate = document.querySelector('#task-time').value;
        if (parseInt(estimate) === 1) {
          return `${estimate} hour`
        } else {
          return `${estimate} hours` 
        };
      }();
      const deadline = document.querySelector('#task-deadline').value;
      const desc = document.querySelector('#task-desc').value;

      const deadlineValiDate = new Date(deadline);
      const todaysValiDate = new Date();

      if (deadlineValiDate < todaysValiDate) {
        e.preventDefault();
        const errorsDisplay = document.querySelector('.form-errors');
        errorsDisplay.textContent = `* Can't create task with deadline in the past!`;
        deadlineInput.value = '';
        return;
      }

      const newItem = new Task(
        cat,
        title,
        priority,
        estimate,
        deadline,
        desc,
      );

      userTasks.push(newItem);
      console.log(`created ${item.dataset.value}`);

      if (newItem.cat !== 'individual') {
        userProjects[newItem.cat].tasks.push(newItem.taskID);
      };
    };

    if (item.dataset.value === 'proj') {
      const name = document.querySelector('#proj-name').value;
      const priority = document.querySelector('#proj-priority').value;
      const repo = document.querySelector('#proj-repo').value;
      const deadline = document.querySelector('#proj-deadline').value;
      const desc = document.querySelector('#proj-desc').value;

      // Actual actual form validation
      const deadlineValiDate = new Date(deadline);
      const todayValiDate = new Date();

      if (deadlineValiDate < todayValiDate) {
        e.preventDefault();
        const errorsDisplay = document.querySelector('.form-errors');
        errorsDisplay.textContent = `* Can't create project with deadline in the past!`;
        deadlineInput.value = '';
        return;
      }

      const newItem = new Proj(
        name,
        priority,
        repo,
        deadline,  
        desc,
      );
      userProjects.push(newItem);
    };

    setStoredData();
    populateBackendWrapper();

    newTaskModal.close();
    clearErrors();
    clearFormInputs();
  });
});
