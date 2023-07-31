import logo from './logo.png';
import './App.css';
import { Button, TextField } from '@mui/material';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const registerUser = () => {
    fetch('/api/register', { // Make sure the API endpoint is correct
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate('/'); // Redirect to the home page
        } else {
          // Handle registration failure, possibly by displaying an error message
        }
      });
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={registerUser}>Register</button>
    </div>
  );
}


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const loginUser = () => {
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem('token', data.token);
          navigate('/'); // Redirect to the home page
        } else {
          // Handle login failure
        }
      });
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={loginUser}>Login</button>
    </div>
  );
}

function MyComponent() {
  return (
    <div>
      <TextField label="Username" variant="outlined" />
      <Button variant="contained" color="primary">
        Login
      </Button>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState(() => {
    // Try to load tasks from local storage when initializing state
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState('All');

  const [inputValue, setInputValue] = useState('');

  const addTask = (taskTitle, priority) => {
    const newTask = { title: taskTitle, completed: false, priority: priority };
    setTasks([...tasks, newTask]);
  };
  const [priorityValue, setPriorityValue] = useState('Normal');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Normal':
        return '#c1ff72';
      case 'Low':
        return 'white';
      default:
        return 'black'; // Default color, if priority is something else
    }
  };


  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const startEditing = (index) => {
    setEditingIndex(index);
  };
  const saveEdit = (title) => {
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex].title = title;
    setTasks(updatedTasks);
    setEditingIndex(null);
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  let filteredTasks = tasks;
  if (filter === 'Completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === 'Incomplete') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === 'High' || filter === 'Normal' || filter === 'Low') {
    filteredTasks = tasks.filter(task => task.priority === filter);
  }


  return (
    <div className="App">
      <h1>My To-Do List</h1>
      <div>
        <div>
          <select class="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Tasks</option>
            <option value="Completed">Completed Tasks</option>
            <option value="Incomplete">Incomplete Tasks</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Add a new task"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <select
          value={priorityValue}
          onChange={(e) => setPriorityValue(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>
        <button onClick={() => addTask(inputValue, priorityValue)}>Add</button>
      </div>
      <ul>
        {filteredTasks.map((task, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => {
                    const updatedTasks = [...tasks];
                    updatedTasks[index].title = e.target.value;
                    setTasks(updatedTasks);
                  }}
                />
                <button onClick={() => saveEdit(task.title)}>Save</button>
              </>
            ) : (
              <>
                {task.completed ? (
                  <s>
                    {task.title} {" "}
                    <span style={{ color: getPriorityColor(task.priority), fontWeight: "bold" }}>
                      {task.priority}
                    </span>
                  </s>
                ) : (
                  <>
                    {task.title} {" "}
                    <span style={{ color: getPriorityColor(task.priority), fontWeight: "bold" }}>
                      {task.priority}
                    </span>
                  </>
                )}
                <button onClick={() => toggleCompletion(index)}>Toggle</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
                <button onClick={() => startEditing(index)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/register" className="nav-link">Register</Link>
            </li>
            <li>
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<App />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainApp;