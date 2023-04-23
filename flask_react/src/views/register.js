import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    axios({
      method: "POST",
      url: "/registerAuth",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const res = response.data;
        setProfileData({
          username: res.username,
          password: res.password,
        });
        if (response.status === 200) {
          setSuccess(res.success);
          console.log(res.success);
          navigate("/");
        } else {
          setError(res.error);
          console.log(res.error);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <br />
        <input type="submit" value="Register" />
        {error && (
          <p className="error">
            <strong>Error:</strong> {error}
          </p>
        )}
      </form>
      <a href="/">Go back</a>
    </div>
  );
}

export default Register;
