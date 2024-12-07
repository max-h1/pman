import React from "react";
import { useState } from "react";
import Modal, { ModalProps } from "../Modal";
import axios from "../../../API/axios";
import { Entry } from "../../../types";
import "../Modal.css";

interface EditEntryProps extends ModalProps {
  entry: Entry;
  onConfirm: (updatedEntry: Entry) => void;
}

const EditEntryModal: React.FC<EditEntryProps> = ({
  isOpen,
  onClose,
  entry,
  onConfirm,
}) => {
  const [currentEntry, setCurrentEntry] = useState<Entry>({
    id: entry.id,
    service: entry.service,
    user: entry.user,
    password: entry.password,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Entry">
      <section className="inputs">
        <label htmlFor="service">Service:</label>
        <input
          id="service"
          type="text"
          value={currentEntry.service}
          onChange={(e) => {
            setCurrentEntry({ ...currentEntry, service: e.target.value });
          }}
          placeholder="Enter service"
        />
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          autoComplete="false"
          type="text"
          value={currentEntry.user}
          onChange={(e) => {
            setCurrentEntry({ ...currentEntry, user: e.target.value });
          }}
          placeholder="Enter username"
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={currentEntry.password}
          onChange={(e) => {
            setCurrentEntry({ ...currentEntry, password: e.target.value });
          }}
          placeholder="Enter password"
        />
        <button
          onClick={() => onConfirm(currentEntry)}
          type="submit"
          disabled={
            !currentEntry.service.trim() ||
            !currentEntry.password.trim() ||
            !currentEntry.user.trim()
          }
        >
          Confirm
        </button>
      </section>
    </Modal>
  );
};

export default EditEntryModal;
