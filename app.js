// Select elements
const form = document.querySelector("form");
const input = document.querySelector("form input");
const taskList = document.querySelector(".task-list");
const progress = document.getElementById("progress");
const numbers = document.getElementById("numbers");
const clearAllBtn = document.getElementById("clear-all");

// Store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Handle form submit (CREATE)
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = input.value.trim();

    if (taskText === "") return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    input.value = "";
    saveTasks();
    renderTasks();
});

// Render tasks (READ)
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        // Mark completed
        if (task.completed) {
            li.classList.add("completed");
        }

        // Toggle complete on click
        li.addEventListener("click", () => toggleComplete(task.id));

        // Edit button (UPDATE)
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.style.marginLeft = "10px";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            editTask(task.id);
        });

        // Delete button (DELETE)
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.style.marginLeft = "10px";
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });

        li.appendChild(editBtn);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });

    updateStats();
}

// Toggle complete
function toggleComplete(id) {
    tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Edit (UPDATE)
function editTask(id) {
    const task = tasks.find((t) => t.id === id);
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Delete (DELETE)
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}

// Clear All Tasks
clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});

// Update stats and progress bar
function updateStats() {
    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;

    numbers.textContent = `${completedTasks} / ${totalTasks}`;

    if (totalTasks === 0) {
        progress.style.width = "0%";
    } else {
        progress.style.width = `${(completedTasks / totalTasks) * 100}%`;
    }
}

// Save to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initial render
renderTasks();
