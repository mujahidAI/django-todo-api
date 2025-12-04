// // src/components/Home.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
// import "../styles/home.css";

// function Home() {
//   const navigate = useNavigate();                // ✅ ADD THIS

//   const [todos, setTodos] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [error, setError] = useState("");

//   // Fetch todos on load
//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   const fetchTodos = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/api/todos/");
//       const data = await res.json();
//       setTodos(data);
//     } catch (err) {
//       console.error("Failed to fetch todos:", err);
//     }
//   };

//   // Add new todo
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       setError("Title is required.");
//       return;
//     }

//     const newTodo = { title, description };

//     try {
//       const res = await fetch("http://localhost:8000/api/todos/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newTodo),
//       });

//       if (!res.ok) throw new Error("Failed to add todo.");

//       const data = await res.json();

//       setTodos((prev) => [...prev, data]);
//       setTitle("");
//       setDescription("");
//       setError("");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div>
//         <h1>Todo Dashboard</h1>
//         <p className="subtitle">
//           Track your tasks, stay organized, and keep an eye on what’s next.
//         </p>

//         <div className="column-title">
//           <h2>Todo List</h2>
//           <span className="pill">Live from API</span>
//         </div>

//         <div className="todos-panel">
//           {todos.length === 0 ? (
//             <p>No todos available.</p>
//           ) : (
//             todos.map((todo) => (
//               <div
//                 key={todo.id}
//                 className="todo-item"
//                 onClick={() => navigate(`/todo/${todo.id}`)}  // ✅ NOW WORKS
//                 style={{ cursor: "pointer" }}                // Optional improvement
//               >
//                 <h3>{todo.title}</h3>
//                 <p>{todo.description}</p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       <div className="form-panel">
//         <h2>Add New Todo</h2>
//         <p>Create a task with a clear title and an optional description.</p>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="title">Task title</label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               placeholder="e.g. Prepare Django API docs"
//               required
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="description">Task description (optional)</label>
//             <textarea
//               id="description"
//               name="description"
//               placeholder="Add more details so future-you thanks you."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>
//           </div>

//           <button type="submit">Add Todo</button>

//           {error && <div className="error-message">{error}</div>}

//           <p className="small-text">
//             New tasks start as pending. You can mark them done from the API.
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Home;


// src/components/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Fetch existing todos when the component loads
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/todos/");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  // Handles submit of new todo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const newTodo = {
      title,
      description,
    };

    try {
      const res = await fetch("http://localhost:8000/api/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!res.ok) {
        throw new Error("Failed to add todo.");
      }

      const data = await res.json();

      // Add new todo to the list
      setTodos((prev) => [...prev, data]);

      // Clear inputs
      setTitle("");
      setDescription("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper to format date (if your API sends updated_at)
  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };

  return (
    <div className="app-container">
      <div>
        <h1>Todo Dashboard</h1>
        <p className="subtitle">
          Track your tasks, stay organized, and keep an eye on what’s next.
        </p>

        <div className="column-title">
          <h2>Todo List</h2>
          <span className="pill">Live from API</span>
        </div>

        <div className="todos-panel">
          {todos.length === 0 ? (
            <p>No todos available.</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="todo-item"
                onClick={() => navigate(`/todo/${todo.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>

                {/* Status line */}
                <p
                  className={
                    todo.is_completed ? "status status-completed" : "status status-pending"
                  }
                >
                  {todo.is_completed ? "Completed" : "Pending"}
                </p>

                {/* Updated timestamp (if available from API) */}
                {todo.updated_at && (
                  <p className="updated-at">
                    Updated: {formatDate(todo.updated_at)}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="form-panel">
        <h2>Add New Todo</h2>
        <p>Create a task with a clear title and an optional description.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Prepare Django API docs"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Task description (optional)</label>
            <textarea
              id="description"
              name="description"
              placeholder="Add more details so future-you thanks you."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button type="submit">Add Todo</button>

          {error && <div className="error-message">{error}</div>}

          <p className="small-text">
            New tasks start as pending. You can mark them done from the API.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Home;
