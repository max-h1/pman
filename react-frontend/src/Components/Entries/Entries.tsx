import axios from "axios";
import { useState, useEffect } from "react";
import "./Entries.css";
import { v4 as uuid } from "uuid";

// Define the shape of each password entry
type Entry = { id: string; service: string; user: string; password: string };

const Entries = () => {
  // Type the state variables to match PasswordEntry
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>({
    id: "",
    service: "",
    user: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/entries")
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => console.error("Error fetching passwords:", error));
  }, []);

  const addEntry = () => {
    newEntry.id = uuid();
    axios
      .post("http://127.0.0.1:5000/api/entries", newEntry)
      .then((response) => setEntries([...entries, response.data]))
      .catch((error) => console.error("Error adding password:", error));
    setNewEntry({ id: "", service: "", user: "", password: "" });
  };

  const deleteEntry = (id: string) => {
    axios
      .delete(`http://127.0.0.1:5000/api/entries/${id}`, {
        data: {},
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        const updatedEntries = entries.filter((entry) => entry.id != id);
        setEntries(updatedEntries);
      })
      .catch((error) => console.error("Error adding password:", error));
  };

  const editEntry = (id: string) => {};

  return (
    <div className="entries">
      <h2>Entries</h2>
      <div className="input-wrapper">
        <input
          type="text"
          value={newEntry.service}
          onChange={(e) =>
            setNewEntry({ ...newEntry, service: e.target.value })
          }
          placeholder="Enter service"
        />
        <input
          type="text"
          value={newEntry.user}
          onChange={(e) => setNewEntry({ ...newEntry, user: e.target.value })}
          placeholder="Enter login"
        />
        <input
          type="text"
          value={newEntry.password}
          onChange={(e) =>
            setNewEntry({ ...newEntry, password: e.target.value })
          }
          placeholder="Enter password"
        />
        <button
          onClick={addEntry}
          disabled={
            !newEntry.service.trim() ||
            !newEntry.password.trim() ||
            !newEntry.user.trim()
          }
        >
          Add Entry
        </button>
      </div>
      <ul>
        {entries.map((entry, index) => (
          <div className="entry" key={index}>
            <div className="entry-info">
              <b>{entry.service}</b> | User: {entry.user} | Password:{" "}
              {entry.password}
            </div>
            <div className="entry-options">
              <dialog>
                <h1>This is a dialog.</h1>
                <button id="closeDialog">Close dialog</button>
              </dialog>
              <button
                onClick={() => {
                  editEntry(entry.id);
                }}
              >
                Edit
              </button>
              <button onClick={() => deleteEntry(entry.id)}>Delete</button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Entries;
