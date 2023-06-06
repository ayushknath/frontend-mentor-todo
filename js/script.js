function createTask(task) {
  const li = document.createElement("li");

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("data-check-task", "");

  const span = document.createElement("span");
  span.textContent = task;

  const button = document.createElement("button");
  button.className = "delete-task";
  button.setAttribute("data-delete-task", "");

  const img = document.createElement("img");
  img.setAttribute("src", "images/icon-cross.svg");
  img.setAttribute("alt", "Delete task");

  button.appendChild(img);

  li.append(input, span, button);

  return li;
}

function removeTask(deleteIndex) {
  numTasks = 0;

  taskArr.forEach((task, index) => {
    if (index === deleteIndex) {
      return;
    }

    if (!task.isChecked) {
      numTasks++;
    }
  });

  taskArr.splice(deleteIndex, 1);

  taskList.children[deleteIndex].remove();

  taskCount.textContent = numTasks;

  localStorage.setItem("task", JSON.stringify(taskArr));
}

function checkTask(checkbox) {
  const spanText = checkbox.nextElementSibling.textContent;
  let itemIndex;

  taskArr.forEach((task, index) => {
    if (task.text === spanText) {
      itemIndex = index;
    }
  });

  if (checkbox.checked) {
    taskArr[itemIndex].isChecked = true;
    taskCount.textContent = --numTasks;
  } else {
    taskArr[itemIndex].isChecked = false;
    taskCount.textContent = ++numTasks;
  }

  localStorage.setItem("task", JSON.stringify(taskArr));
}

function filterAll() {
  for (let i = 0; i < taskList.children.length; i++) {
    taskList.children[i].style.display = "grid";
  }
}

function filterActive() {
  taskArr.forEach((task, index) => {
    if (task.isChecked) {
      taskList.children[index].style.display = "none";
    } else {
      taskList.children[index].style.display = "grid";
    }
  });
}

function filterCompleted() {
  taskArr.forEach((task, index) => {
    if (!task.isChecked) {
      taskList.children[index].style.display = "none";
    } else {
      taskList.children[index].style.display = "grid";
    }
  });
}

const taskInput = document.querySelector("[data-add-task]");
const formElement = taskInput.parentElement;
const taskList = document.querySelector("[data-task-list]");
const taskCount = document.querySelector("[data-task-count]");
let numTasks = 0;
taskCount.textContent = numTasks;
const filterQueries = document.querySelectorAll("[data-filter]");
const clearCompleted = document.querySelector("[data-clear-completed]");

// Task array
const taskArr = Boolean(localStorage.getItem("task"))
  ? JSON.parse(localStorage.getItem("task"))
  : [];

// Check if task array is empty
if (taskArr.length > 0) {
  taskArr.forEach((task, index) => {
    taskList.appendChild(createTask(task.text));

    if (task.isChecked) {
      taskList.children[index].firstElementChild.checked = true;
    } else {
      taskCount.textContent = ++numTasks;
    }
  });
}

// Add task
formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = taskInput.value;

  if (task === "") {
    return;
  }

  taskList.appendChild(createTask(task));

  taskCount.textContent = ++numTasks;

  taskArr.push({
    text: task.trim(),
    isChecked: false,
  });

  localStorage.setItem("task", JSON.stringify(taskArr));

  taskInput.value = "";
});

taskList.addEventListener("click", (e) => {
  // Remove task
  if (e.target.closest("[data-delete-task")) {
    taskArr.forEach((task, index) => {
      if (
        task.text ===
        e.target.closest("[data-delete-task").previousElementSibling.textContent
      ) {
        removeTask(index);
      }
    });
  }

  // Check task
  if (e.target.closest("[data-check-task]")) {
    checkTask(e.target.closest("[data-check-task]"));
  }
});

filterQueries.forEach((filterQuery) => {
  filterQuery.addEventListener("click", () => {
    const filterMenu = filterQuery.parentElement;

    for (let i = 0; i < filterMenu.children.length; i++) {
      filterMenu.children[i].classList.remove("active");
    }

    filterQuery.classList.add("active");

    switch (filterQuery.dataset.filter) {
      case "all":
        filterAll();
        break;
      case "active":
        filterActive();
        break;
      case "completed":
        filterCompleted();
        break;
      default:
        return;
    }
  });
});

clearCompleted.addEventListener("click", () => {
  let taskListLength = taskArr.length;

  for (let i = 0; i < taskListLength; i++) {
    if (taskArr[i].isChecked) {
      removeTask(i);
      taskListLength = taskArr.length;
      i--;
    }
  }
});
