import React from "react";
import { useState } from "react";
import Modal, { ModalProps } from "../Modal";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Entry } from "../../../types";
import "../Modal.css";

interface EditEntryProps extends ModalProps {
  entry: Entry;
  onSave: (updatedEntry: Entry) => void;
}

const EditEntryModal: React.FC<EditEntryProps> = ({
  isOpen,
  onClose,
  entry,
  onSave,
}) => {
  const [currentEntry, setCurrentEntry] = useState<Entry>({
    id: entry.id,
    service: entry.service,
    user: entry.user,
    password: entry.password,
  });
  const saveEntry = (entry: Entry) => {
    axios
      .put(`http://127.0.0.1:5000/api/entries/${entry.id}`, entry)
      .then((response) => {
        if (response.status == 200) {
          onSave(entry);
        }
      })
      .catch((error) => console.error("Error editing password:", error));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Entry">
      <div className="inputs">
        <input
          type="text"
          value={currentEntry.service}
          onChange={(e) => {
            setCurrentEntry({ ...currentEntry, service: e.target.value });
          }}
          placeholder="Enter service"
        />
        <input
          type="text"
          value={currentEntry.user}
          onChange={(e) => {
            setCurrentEntry({ ...currentEntry, user: e.target.value });
          }}
          placeholder="Enter username"
        />
        <input
          type="text"
          value={currentEntry.password}
          onChange={(e) => {
            setCurrentEntry({ ...currentEntry, password: e.target.value });
          }}
          placeholder="Enter password"
        />
        <button
          onClick={() => {
            saveEntry(currentEntry);
          }}
          disabled={
            !currentEntry.service.trim() ||
            !currentEntry.password.trim() ||
            !currentEntry.user.trim()
          }
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default EditEntryModal;
