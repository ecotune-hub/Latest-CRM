import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState(() => {
    // Load todos from localStorage on initial render
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    // Save todos to localStorage whenever they change
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { text: input, done: false }]);
    setInput("");
  };

  const toggleDone = (idx) => {
    setTodos(
      todos.map((todo, i) =>
        i === idx ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleDelete = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>To-Do List</h1>
      <form onSubmit={handleAdd} style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>Add</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {todos.map((todo, idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #eee"
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(idx)}
            />
            <span
              style={{
                marginLeft: 8,
                flex: 1,
                textDecoration: todo.done ? "line-through" : "none"
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDelete(idx)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
