# Todo App (Django REST API + React)

Full-stack Todo application with Django REST API backend and React (Vite) frontend.

## 📁 Structure

```
backend/     # Django + DRF API
frontend/    # React (Vite)
```

## 🚀 Features

- CRUD operations for todos
- Completion status tracking
- Auto timestamps
- REST API with Django REST Framework

## 🗄️ API

**Model:** `title` (required, max 200) · `description` (optional) · `is_completed` (default: false) · `created_at` · `updated_at`

**Endpoints:** `GET|POST /api/todos/` · `GET|PUT|PATCH|DELETE /api/todos/{id}/`

## ⚙️ Local Setup

**1. Clone**
```bash
git clone <https://github.com/mujahidAI/django-todo-api>
cd "Todo App"
```

**2. Backend**
```bash
python -m venv venv
# Activate: venv\Scripts\Activate.ps1 (Windows) or source venv/bin/activate (macOS/Linux)
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # http://localhost:8000
```

**3. Frontend** (new terminal)
```bash
cd frontend
cp .env.example .env  # or: copy .env.example .env (Windows)
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000
```

Install & run:
```bash
npm install
npm run dev  # http://localhost:5173
```

## 📌 Usage

**Create:** `POST /api/todos/` → `{"title": "Learn Django", "description": "Build API"}`

**Complete:** `PATCH /api/todos/1/` → `{"is_completed": true}`

## 📝 Notes

- Todos ordered by most recently updated