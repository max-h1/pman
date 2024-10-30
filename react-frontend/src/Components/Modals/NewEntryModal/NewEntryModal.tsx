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
  };
  return (
    <Modal isOpen={false} onClose={onClose}>
      <h2>New Entry</h2>
      <input></input>
      <input></input>
    </Modal>
  );
};

export default NewEntryModal;
