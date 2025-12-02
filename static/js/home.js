document.addEventListener('DOMContentLoaded', () => {
    const todoListDiv = document.getElementById('todo-list');
    const form = document.getElementById('todo-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const formError = document.getElementById('form-error');

    function getCSRFToken() {
        const csrfInput = document.querySelector('input[name=csrfmiddlewaretoken]');
        return csrfInput ? csrfInput.value : '';
    }

    function renderTodos(data) {
        const todos = Array.isArray(data) ? data : (data.results || []);
        todoListDiv.innerHTML = '';

        if (todos.length === 0) {
            todoListDiv.innerHTML = '<p class="empty-message">No todos available. 🎉 Add your first task on the right.</p>';
            return;
        }

        todos.forEach(todo => {
            const item = document.createElement('div');
            item.classList.add('todo-item');
            if (todo.is_completed) item.classList.add('completed');

            item.addEventListener('click', () => {
                window.location.href = `/todos/${todo.id}/`;
            });

            item.innerHTML = `
                <div class="todo-title">${todo.title}</div>
                ${todo.description ? `<div class="todo-description">${todo.description}</div>` : ''}
                <div class="todo-meta">
                    <span class="todo-status ${todo.is_completed ? 'completed' : 'pending'}">
                        ${todo.is_completed ? 'Completed' : 'Pending'}
                    </span>
                    <span>Updated: ${todo.updated_at}</span>
                </div>
            `;

            todoListDiv.appendChild(item);
        });
    }

    async function loadTodos() {
        try {
            const response = await fetch('/api/todos/');
            if (!response.ok) {
                todoListDiv.innerHTML = '<p class="empty-message">Error loading todos.</p>';
                return;
            }
            renderTodos(await response.json());
        } catch {
            todoListDiv.innerHTML = '<p class="empty-message">Error loading todos.</p>';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.style.display = 'none';

        const newTodo = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim()
        };

        if (!newTodo.title) {
            formError.textContent = 'Title is required.';
            formError.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/api/todos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify(newTodo)
            });

            if (!response.ok) {
                formError.textContent = 'Error creating todo.';
                formError.style.display = 'block';
                return;
            }

            titleInput.value = '';
            descriptionInput.value = '';
            loadTodos();
        } catch {
            formError.textContent = 'Network error.';
            formError.style.display = 'block';
        }
    });

    loadTodos();
});
