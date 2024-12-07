import axios from "../../../API/axios";
import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../../Hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { pbkdf2, strToAB, ABtoStr } from "../../../Utils/Encryption";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { setAuth } = useAuth(); // Access login from AuthContext
  const navigate = useNavigate();

  const Attemptlogin = async (username: string, password: string) => {
    setLoading(true);
    setLoginError("");

    const passwordBuf = strToAB(password);
    const usernameBuf = strToAB(username);

    const masterKey = await pbkdf2(passwordBuf, usernameBuf);
    const mph: ArrayBuffer = await pbkdf2(masterKey, passwordBuf);
    const mphStr = ABtoStr(mph);

    axios
      .post(
        "/api/auth/login",
        { username, mph: mphStr },
        { withCredentials: true }
      )
      .then((response) => {
        if (response?.status === 200) {
          setAuth(true);
          navigate("/dashboard");
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
        <button type="button" disabled={loading} onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {loginError && <p className="error">{loginError}</p>}
        <Link to="/register">Create Account</Link>
      </form>
    </section>
  );
};

export default Login;
