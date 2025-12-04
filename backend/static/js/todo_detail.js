const todoId = document.getElementById("todo-id").value;
const form = document.getElementById("todo-form");
const deleteBtn = document.getElementById("delete-btn");

const modal = document.getElementById("message-modal");
const modalText = document.getElementById("modal-text");
const modalActions = document.getElementById("modal-actions");

/* Modal Helpers */
function showMessage(message, isError = false) {
    modalText.textContent = message;
    modalText.style.color = isError ? "#b91c1c" : "#1f2937";

    modalActions.innerHTML = `
        <button class="px-4 py-2 rounded bg-indigo-600 text-white">OK</button>
    `;

    modalActions.querySelector("button").onclick = () => {
        modal.classList.add("hidden");
    };

    modal.classList.remove("hidden");
}

function showConfirmation(message) {
    return new Promise((resolve) => {
        modalText.textContent = message;

        modalActions.innerHTML = `
            <button id="cancel-btn" class="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button id="confirm-btn" class="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
        `;

        document.getElementById("cancel-btn").onclick = () => {
            modal.classList.add("hidden");
            resolve(false);
        };

        document.getElementById("confirm-btn").onclick = () => {
            modal.classList.add("hidden");
            resolve(true);
        };

        modal.classList.remove("hidden");
    });
}

/* CSRF */
function getCSRFToken() {
    const csrfInput = document.querySelector("input[name=csrfmiddlewaretoken]");
    return csrfInput ? csrfInput.value : "";
}

/* Load Todo into Form */
async function loadTodo() {
    try {
        const response = await fetch(`/api/todos/${todoId}/`);
        const todo = await response.json();

        document.getElementById("title").value = todo.title;
        document.getElementById("description").value = todo.description || "";
        document.getElementById("is_completed").checked = todo.is_completed;
    } catch (e) {
        showMessage("Error loading todo.", true);
    }
}

/* Update Todo */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        is_completed: document.getElementById("is_completed").checked,
    };

    if (!payload.title) {
        showMessage("Title cannot be empty.", true);
        return;
    }

    try {
        const response = await fetch(`/api/todos/${todoId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(),
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            showMessage("To-Do updated successfully!");
        } else {
            showMessage("Error updating todo.", true);
        }
    } catch {
        showMessage("Network error.", true);
    }
});

/* Delete Todo */
deleteBtn.addEventListener("click", async () => {
    const confirmed = await showConfirmation("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
        const response = await fetch(`/api/todos/${todoId}/`, {
            method: "DELETE",
            headers: { "X-CSRFToken": getCSRFToken() },
        });

        if (response.status === 204 || response.ok) {
            showMessage("Deleted! Redirecting...");
            setTimeout(() => (window.location.href = "/"), 800);
        } else {
            showMessage("Error deleting todo.", true);
        }
    } catch {
        showMessage("Network error while deleting.", true);
    }
});

document.addEventListener("DOMContentLoaded", loadTodo);
