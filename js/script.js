let todos = [];
let currentEditIndex = null;

function renderTodos(list = todos) {
  const container = document.getElementById('items');
  container.innerHTML = '';
  list.forEach((todo, index) => {
    const div = document.createElement('div');
    div.className = 'todo-item';
    div.onclick = (e) => {
      if(e.target.tagName !== 'BUTTON') showPopup(index);
    };

    div.innerHTML = `
      <div class="info">
        <strong>${todo.title}</strong> | ${todo.status} | ${todo.date}
      </div>
      <div class="actions">
        <button onclick="toggleStatus(${index}); event.stopPropagation();">Change Status</button>
        <button onclick="deleteTodo(${index}); event.stopPropagation();">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function addTodo() {
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  if(!title || !date) return alert("Please fill Title and Date");

  todos.push({title, date, description, status:'Pending'});
  renderTodos();
  document.getElementById('title').value = '';
  document.getElementById('date').value = '';
  document.getElementById('description').value = '';
}

function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

function toggleStatus(index) {
  todos[index].status = todos[index].status === 'Pending' ? 'Finished' : 'Pending';
  renderTodos();
}

function deleteAll() {
  if(confirm("Are you sure you want to delete all todos?")) {
    todos = [];
    renderTodos();
  }
}

/*
function filterTodos() {
  const type = prompt("Filter by: title/status/date");
  const value = prompt("Enter value to filter");
  if(type && value) {
    const filtered = todos.filter(todo => String(todo[type]).toLowerCase().includes(value.toLowerCase()));
    renderTodos(filtered);
  }
}*/

// New filter state
function filterTodos() {
  document.getElementById('filter-popup').style.display = 'flex';
}

function applyFilters() {
  activeFilters.date = document.getElementById('filter-date').value;
  activeFilters.title = document.getElementById('filter-title').value;
  activeFilters.status = document.getElementById('filter-status').value;

  let filtered = [...todos];

  // Filter by Date
  if (activeFilters.date) {
    filtered = filtered.filter(todo => todo.date === activeFilters.date);
  }

  // Sort by Title
  if (activeFilters.title === "asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (activeFilters.title === "desc") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  // Filter by Status
  if (activeFilters.status) {
    filtered = filtered.filter(todo => todo.status === activeFilters.status);
  }

  renderTodos(filtered);
  closeFilterPopup();
}

function clearFilters() {
  activeFilters = { date: "", title: "", status: "" };
  document.getElementById('filter-date').value = "";
  document.getElementById('filter-title').value = "";
  document.getElementById('filter-status').value = "";
  renderTodos();
  closeFilterPopup();
}

function closeFilterPopup() {
  document.getElementById('filter-popup').style.display = 'none';
}
// New filter state

/* Popup handling */
function showPopup(index) {
  currentEditIndex = index;
  const todo = todos[index];
  document.getElementById('popup-title').innerText = todo.title;
  document.getElementById('popup-date').value = todo.date;
  document.getElementById('popup-description').value = todo.description;
  document.getElementById('popup').style.display = 'flex';
}

function enableEdit() {
  document.getElementById('popup-date').disabled = false;
  document.getElementById('popup-description').disabled = false;
  document.getElementById('save-btn').style.display = 'inline-block';
  document.getElementById('edit-btn').style.display = 'none';
}

function saveEdit() {
  const date = document.getElementById('popup-date').value;
  const description = document.getElementById('popup-description').value;
  todos[currentEditIndex].date = date;
  todos[currentEditIndex].description = description;
  closePopup();
  renderTodos();
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('popup-date').disabled = true;
  document.getElementById('popup-description').disabled = true;
  document.getElementById('save-btn').style.display = 'none';
  document.getElementById('edit-btn').style.display = 'inline-block';
}
