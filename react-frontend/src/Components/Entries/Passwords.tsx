import axios from "axios";
import { useState, useEffect } from "react";

// Define the shape of each password entry
type PasswordEntry = { login: string; password: string };

const PasswordManager = () => {
  // Type the state variables to match PasswordEntry
  const [passwords, setPasswords] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState<string>("");
  const [logins, setLogins] = useState<string[]>([]);
  const [newLogin, setNewLogin] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/entries")
      .then((response) => {
        setPasswords(response.data.passwords);
        setLogins(response.data.logins);
      })
      .catch((error) => console.error("Error fetching passwords:", error));
  }, []);

  const addPassword = () => {
    const entry: PasswordEntry = { login: newLogin, password: newPassword };
    axios
      .post("http://127.0.0.1:5000/api/entries", entry)
      .then((response) => setPasswords([...passwords, response.data]))
      .catch((error) => console.error("Error adding password:", error));
    setNewPassword("");
    setNewLogin("");
  };

  return (
    <div>
      <h2>Password Manager</h2>
      <ul>
        {passwords.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newLogin}
        onChange={(e) => setNewLogin(e.target.value)}
        placeholder="Enter new login"
      />
      <input
        type="text"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
      />
      <button onClick={addPassword} disabled={!newPassword.trim()}>
        Add Password
      </button>
    </div>
  );
};

export default PasswordManager;
