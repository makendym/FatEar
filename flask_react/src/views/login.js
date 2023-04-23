import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  
  const handleSubmit = async (e) => {
      console.log("username :" + username +"\nPass: "+ password);
    e.preventDefault();

    try {
      const response = await axios.post("/loginAuth", {
        username: username,
        password: password,
      });
      if (response.data.success) {
        // Successful login, redirect to home page
        navigate("/home");
      } else {
        // Login failed, display error message
        setError(response.data.error);
        console.log(error);
          }
    } catch (err) {
      console.error(err);
      setError("An error occurred while attempting to log in.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
