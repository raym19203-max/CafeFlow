import "../styles/AdminLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    // Admin login
    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      navigate("/admin");
    } else {
      alert("Invalid admin username or password.");
    }
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-box">

        <div className="admin-login-logo">
          ☕
        </div>

        <h1>
          CafeFlow
        </h1>

        <p className="admin-login-subtitle">
          Admin Login
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-input-group">

            <label>
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

          </div>


          <div className="admin-input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          <button
            type="submit"
            className="admin-login-btn"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;