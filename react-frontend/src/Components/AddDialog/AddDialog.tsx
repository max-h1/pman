import "./AddDialog.css";
import { useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

type Entry = { id: string; service: string; user: string; password: string };

const AddDialog = () => {
  const [newEntry, setNewEntry] = useState<Entry>({
    id: "",
    service: "",
    user: "",
    password: "",
  });

  const addEntry = () => {
    newEntry.id = uuid();
    axios
      .post("http://127.0.0.1:5000/api/entries", newEntry)
      .catch((error) => console.error("Error adding password:", error));
    setNewEntry({ id: "", service: "", user: "", password: "" });
  };
  return (
    <dialog className="dialog" open>
      <input
        type="text"
        value={newEntry.service}
        onChange={(e) => setNewEntry({ ...newEntry, service: e.target.value })}
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
        onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
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
      <button>Cancel</button>
    </dialog>
  );
};

export default AddDialog;
