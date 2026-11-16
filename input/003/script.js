document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const errorDisplay = document.getElementById('error');

  loadTasks();

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
  });

  function addTask() {
    errorDisplay.classList.remove('show');
    const taskText = taskInput.value.trim();

    if (!taskText) {
      showError('Ülesande sisend ei tohi olla tühi!');
      return;
    }

    const tasks = getTasks();
    tasks.push(taskText);
    saveTasks(tasks);
    renderTasks(tasks);
    taskInput.value = '';
  }

  function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks(tasks);
  }

  function loadTasks() {
    const tasks = getTasks();
    renderTasks(tasks);
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="task-text">${escapeHtml(task)}</span>
        <button class="delete-btn" data-index="${index}">Kustuta</button>
      `;
      taskList.appendChild(li);
    });

    taskList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.dataset.index);
        deleteTask(idx);
      });
    });
  }

  function getTasks() {
    const tasksJson = localStorage.getItem('todoTasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  function saveTasks(tasks) {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }

  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.classList.add('show');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
