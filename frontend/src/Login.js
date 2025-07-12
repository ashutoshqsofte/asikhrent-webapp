import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/login', {   // ✅ fixed: removed /api
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login success:", data);  // ✅ log success
        navigate('/dashboard');
      } else {
        console.warn("Login failed:", data);
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Connection error:", err);  // ✅ log connection error
      setMessage("Failed to connect to backend");
    }
  };

  return (
    <div className="login-container">
      <h2>AsikhRent</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {message && <p className="error">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
