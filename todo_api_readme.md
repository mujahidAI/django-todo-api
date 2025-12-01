# Django Todo API

A simple REST API for managing todo items built with Django and Django REST Framework.

## Features

- Create, read, update, and delete todo items
- Track completion status
- Automatic timestamps for creation and modification
- Clean API endpoints with proper serialization

## Models

### Todo
- `title` (CharField, max 200 characters) - The todo item title
- `description` (TextField, optional) - Detailed description of the todo
- `is_completed` (BooleanField) - Completion status (defaults to False)
- `created_at` (DateTimeField) - Automatically set on creation
- `updated_at` (DateTimeField) - Automatically updated on modification

## API Endpoints

The API uses Django REST Framework's ViewSet, which provides the following endpoints:

- `GET /api/todos/` - List all todos (ordered by most recently updated)
- `POST /api/todos/` - Create a new todo
- `GET /api/todos/{id}/` - Retrieve a specific todo
- `PUT /api/todos/{id}/` - Update a todo
- `PATCH /api/todos/{id}/` - Partially update a todo
- `DELETE /api/todos/{id}/` - Delete a todo

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install django djangorestframework
   ```

3. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Usage

### Creating a Todo
```json
POST /api/todos/
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

### Updating a Todo
```json
PATCH /api/todos/1/
{
  "is_completed": true
}
```

## Notes

- When creating todos, only `title` and `description` fields are required
- The `is_completed` field is automatically set to `false` on creation
- Timestamps are formatted as `YYYY-MM-DD HH:MM:SS`
- Todos are sorted by most recently updated by default