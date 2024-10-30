import axios from "axios";
import { useState, useEffect } from "react";
import "./Entries.css";
import { v4 as uuid } from "uuid";
import Searchbar from "../Searchbar/Searchbar";
import NewEntryModal from "../Modals/NewEntryModal/NewEntryModal";

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

  const [searchQuery, setSearchQuery] = useState("");

  const filterSearch = (entry: Entry) => {
    return entry.service.includes(searchQuery);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/entries")
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => console.error("Error fetching passwords:", error));
  }, []);

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
      <div id="entries-head">
        <div id="entries-head-left">
          <h2>Entries</h2>
          <Searchbar query={searchQuery} setQuery={setSearchQuery} />
        </div>
        <button id="openNewEntryModal" onClick={openModal}>
          New
        </button>
        <NewEntryModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
      <ul>
        {entries.filter(filterSearch).map((entry, index) => (
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
