import axios from "axios";
import React, { useState, useContext } from "react";
import { APIURL } from "../../types";
import { useAuth } from "../Providers/Authprovider";
import { Link } from "react-router-dom";
import HashPassword from "../../Utils/Hash";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login } = useAuth(); // Access login from AuthContext

  const Attemptlogin = async (username: string, password: string) => {
    setLoading(true);
    setLoginError("");
    const masterHash = await HashPassword(password);
    axios
      .post(
        `${APIURL}/api/auth/login`,
        { username, masterHash },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          login(response.data.token);
        }
      })
      .catch(() => {
        setLoginError("Login failed. Please check your credentials.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogin = () => {
    let valid = true;
    setUsernameError(false);
    setPasswordError(false);

    if (!username) {
      setUsernameError(true);
      valid = false;
    }
    if (!password) {
      setPasswordError(true);
      valid = false;
    }

    if (valid) {
      Attemptlogin(username, password);
    }
  };

  return (
    <section id="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          autoComplete="false"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p className="error">Username is required.</p>}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className="error">Password is required.</p>}
        <button type="button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {loginError && <p className="error">{loginError}</p>}
        <Link to="/register">Create Account</Link>
      </form>
    </section>
  );
};

export default Login;
