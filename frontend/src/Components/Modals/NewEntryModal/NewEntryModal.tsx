import { useState } from "react";
import axios from "../../../API/axios";
import Modal from "../Modal";
import { ModalProps } from "../Modal";
import { Entry } from "../../../types";

const NewEntryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [newEntry, setNewEntry] = useState<Entry>({
    id: 0,
    service: "",
    user: "",
    password: "",
  });

  const addEntry = () => {
    axios
      .post(`/api/entries`, newEntry, { withCredentials: true })
      .then((response) => {
        newEntry.id = response?.data?.id;
      })
      .catch((error) => console.error("Error adding password:", error));
    onClose(newEntry);
    setNewEntry({
      id: 0,
      service: "",
      user: "",
      password: "",
    });
  };
  return (
    <Modal title="New Entry" isOpen={isOpen} onClose={onClose}>
      <form className="inputs">
        <label htmlFor="service">Service:</label>
        <input
          id="service"
          type="text"
          value={newEntry.service}
          onChange={(e) =>
            setNewEntry({ ...newEntry, service: e.target.value })
          }
          placeholder="Enter service"
        />
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={newEntry.user}
          onChange={(e) => setNewEntry({ ...newEntry, user: e.target.value })}
          placeholder="Enter username"
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
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
      </form>
    </Modal>
  );
};

export default NewEntryModal;
