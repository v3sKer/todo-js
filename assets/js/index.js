const tabTasksBtn = document.querySelector("#tasks-tab-btn");
const tabProjBtn = document.querySelector("#proj-tab-btn");

/*

  FORM SECTION

*/

const newTaskBtn = document.querySelector('#header-newtask-btn');
const newTaskModal = document.querySelector('#newtask-modal');
const newTaskModalCloseBtn = document.querySelector('#newtask-modal-closebtn');

newTaskBtn.addEventListener('click', () => {
  newTaskModal.showModal();
  setActiveFormCategory();
  populateActiveFormCategory();
});

function getActiveFormCategory() {return document.querySelector('.form-cat-active').dataset.value};

function setActiveFormCategory() {
  const taskCategoryBtn = [...document.querySelectorAll('#cat-btn')];
  taskCategoryBtn.map(item => {item.classList.remove('form-cat-active')}); // Remove previously activated button
  taskCategoryBtn[0].classList.add('form-cat-active') // Make task button enabled by default

  // Switch active category button
  taskCategoryBtn.map(item => {
    item.addEventListener('click', () => {
      taskCategoryBtn.map(item => {item.classList.remove('form-cat-active')}); // Remove previously activated button
      item.classList.add('form-cat-active'); // Make clicked button active
      populateActiveFormCategory();
    });
  });
}

function populateActiveFormCategory() {
  [...document.querySelectorAll('.modal-form')].map(item => { // Make sure other forms are disabled
    item.classList.add('modal-form-disabled');
  }) 

  if (getActiveFormCategory() === 'task') {enableForm('task')}

  if (getActiveFormCategory() === 'proj') {enableForm('proj')}
};

function enableForm(item) {
  const formWrapper = document.querySelector(`#${item}-form`);
  formWrapper.classList.remove('modal-form-disabled');
};

function clearFormInputs() {
  const clearedInputs = [...document.querySelectorAll('.clear-input')];
  clearedInputs.map(item => {item.value = ''});
}

document.querySelector('#modal-closebtn').addEventListener('click', () => {
  newTaskModal.close();
  clearFormInputs();
})

// Make sure ESC also clears modal forms on close
document.addEventListener('keydown', function(e) {
  if(e.key == 'Escape'){
    clearFormInputs();
  }
});

