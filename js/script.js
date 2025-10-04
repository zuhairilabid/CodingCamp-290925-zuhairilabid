// Initial todos and current editing index
let todos = [];
let currentEditIndex = null;

// Render the list of To-Do items
function renderTodos(list = todos) {
  const container = document.getElementById('items');
  container.innerHTML = ''; // Clear the container before re-rendering
  list.forEach((todo, index) => {
    const div = document.createElement('div');
    div.className = 'todo-item';
    div.onclick = (e) => {
      if (e.target.tagName !== 'BUTTON') showPopup(index);
    };

    // Apply color based on the status
    const statusColor = todo.status === 'Pending' ? 'red' : 'green';

    div.innerHTML = `
      <div class="info">
        <strong>${todo.title}</strong> | 
        <span style="background-color: ${statusColor}; color: white; padding: 2px 8px; border-radius: 4px;">${todo.status}</span> | 
        ${todo.date}
      </div>
      <div class="actions">
        <button class="status-btn" onclick="toggleStatus(${index}); event.stopPropagation();">Change Status</button>
        <button class="delete-btn" onclick="deleteTodo(${index}); event.stopPropagation();">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Add a new To-Do item with validation for Description length
function addTodo() {
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;

  // Check if title or date are missing
  if (!title || !date) return alert("Please fill Title and Date");

  // Validate description length
  if (description.length > 300) {
    return alert("Description cannot be more than 300 characters.");
  }

  todos.push({ title, date, description, status: 'Pending' });
  renderTodos();

  // Clear inputs
  document.getElementById('title').value = '';
  document.getElementById('date').value = '';
  document.getElementById('description').value = '';
}

// Delete a To-Do item
function deleteTodo(index) {
  todos.splice(index, 1);
  renderTodos();
}

// Toggle the status of a To-Do item between "Pending" and "Finished"
function toggleStatus(index) {
  todos[index].status = todos[index].status === 'Pending' ? 'Finished' : 'Pending';
  renderTodos();
}

// Delete all To-Do items with confirmation
function deleteAll() {
  if (confirm("Are you sure you want to delete all todos?")) {
    todos = [];
    renderTodos();
  }
}

// Filtering
let activeFilters = { date: "", title: "", status: "" };

// Open the filter popup
function filterTodos() {
  document.getElementById('filter-popup').style.display = 'flex';
}

// Apply filters and update the todo list based on filters
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

// Clear all filters and reset the view
function clearFilters() {
  activeFilters = { date: "", title: "", status: "" };
  document.getElementById('filter-date').value = "";
  document.getElementById('filter-title').value = "";
  document.getElementById('filter-status').value = "";
  renderTodos();
  closeFilterPopup();
}

// Close the filter popup
function closeFilterPopup() {
  document.getElementById('filter-popup').style.display = 'none';
}

// Popup handling for editing a To-Do item
function showPopup(index) {
  currentEditIndex = index;
  const todo = todos[index];
  document.getElementById('popup-title').innerText = todo.title;
  document.getElementById('popup-date').value = todo.date;
  document.getElementById('popup-description').value = todo.description;
  document.getElementById('popup').style.display = 'flex';
}

// Enable editing mode in the popup
function enableEdit() {
  document.getElementById('popup-date').disabled = false;
  document.getElementById('popup-description').disabled = false;
  document.getElementById('save-btn').style.display = 'inline-block';
  document.getElementById('edit-btn').style.display = 'none';
}

// Save edited To-Do item with validation for Description length
function saveEdit() {
  const date = document.getElementById('popup-date').value;
  const description = document.getElementById('popup-description').value;

  // Validate description length
  if (description.length > 300) {
    return alert("Description cannot be more than 300 characters.");
  }

  todos[currentEditIndex].date = date;
  todos[currentEditIndex].description = description;
  closePopup();
  renderTodos();
}

// Close the edit popup and revert any changes
function closePopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('popup-date').disabled = true;
  document.getElementById('popup-description').disabled = true;
  document.getElementById('save-btn').style.display = 'none';
  document.getElementById('edit-btn').style.display = 'inline-block';
}
