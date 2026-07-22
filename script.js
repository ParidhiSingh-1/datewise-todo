const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskContainer = document.getElementById("taskContainer");

// Load tasks from localStorage
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
  for (const date in savedTasks) {
    savedTasks[date].forEach(task => renderTask(task.text, task.completed, date));
  }
  if(localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value || new Date().toISOString().split("T")[0];
  if (text === "") return;
  renderTask(text, false, date);
  saveTasks();
  taskInput.value = "";
}

function renderTask(text, completed, date) {
  let dateGroup = document.querySelector(`[data-date='${date}']`);
  if (!dateGroup) {
    dateGroup = document.createElement("div");
    dateGroup.classList.add("date-group");
    dateGroup.setAttribute("data-date", date);
    dateGroup.innerHTML = `<h2>${date}</h2><ul></ul>`;
    taskContainer.appendChild(dateGroup);
  }

  const li = document.createElement("li");
  if (completed) li.classList.add("completed");
  li.innerHTML = `
    <span>${text}</span>
    <div class="actions">
      <button class="complete" onclick="toggleComplete(this)">✔</button>
      <button class="delete" onclick="deleteTask(this)">✖</button>
    </div>
  `;
  dateGroup.querySelector("ul").appendChild(li);
}

function toggleComplete(button) {
  const li = button.closest("li");
  li.classList.toggle("completed");
  saveTasks();
}

function deleteTask(button) {
  const li = button.closest("li");
  const ul = li.parentElement;
  li.remove();
  if (ul.children.length === 0) {
    ul.parentElement.remove();
  }
  saveTasks();
}

function saveTasks() {
  const tasks = {};
  document.querySelectorAll(".date-group").forEach(group => {
    const date = group.getAttribute("data-date");
    tasks[date] = [];
    group.querySelectorAll("li").forEach(li => {
      tasks[date].push({
        text: li.querySelector("span").innerText,
        completed: li.classList.contains("completed")
      });
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}
