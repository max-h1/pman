import "./NewEntryModal.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Modal from "../Modal";
import { ModalProps } from "../Modal";

type Entry = { id: string; service: string; user: string; password: string };

const NewEntryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
    onClose();
  };
  return (
    <Modal title="New Entry" isOpen={isOpen} onClose={onClose}>
      <div className="inputs">
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
          placeholder="Enter username"
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
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default NewEntryModal;
