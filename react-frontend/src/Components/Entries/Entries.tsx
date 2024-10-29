import axios from "axios";
import { useState, useEffect } from "react";

// Define the shape of each password entry
type Entry = { login: string; password: string };

const Entries = () => {
  // Type the state variables to match PasswordEntry
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>({ login: "", password: "" });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/entries")
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => console.error("Error fetching passwords:", error));
  }, []);

  const addEntry = () => {
    axios
      .post("http://127.0.0.1:5000/api/entries", newEntry)
      .then((response) => setEntries([...entries, response.data]))
      .catch((error) => console.error("Error adding password:", error));
    setNewEntry({ login: "", password: "" });
  };

  return (
    <div>
      <h2>Entries</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            Login: {entry.login} | Password: {entry.password}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newEntry.login}
        onChange={(e) => setNewEntry({ ...newEntry, login: e.target.value })}
        placeholder="Enter new login"
      />
      <input
        type="text"
        value={newEntry.password}
        onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
        placeholder="Enter new password"
      />
      <button
        onClick={addEntry}
        disabled={!newEntry.password.trim() || !newEntry.login.trim()}
      >
        Add Entry
      </button>
    </div>
  );
};

export default Entries;
