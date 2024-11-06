import axios from "axios";
import { useState, useEffect } from "react";
import "./Entries.css";
import { v4 as uuid } from "uuid";
import Searchbar from "../Searchbar/Searchbar";
import NewEntryModal from "../Modals/NewEntryModal/NewEntryModal";
import EditEntryModal from "../Modals/EditEntryModal/EditEntryModal";
import { Entry, APIURL } from "../../types";

const Entries = () => {
  // Type the state variables to match PasswordEntry
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);

  const filterSearch = (entry: Entry) => {
    return entry.service.includes(searchQuery);
  };

  const openNewEntryModal = () => setIsNewEntryModalOpen(true);

  const closeNewEntryModal = (newEntry: Entry) => {
    setIsNewEntryModalOpen(false);
    setEntries([...entries, newEntry]);
  };

  const openEditModal = (entry: Entry) => {
    setCurrentEntry(entry);
    setIsEditEntryModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditEntryModalOpen(false);
    setCurrentEntry(null);
  };

  const saveEditedEntry = (updatedEntry: Entry) => {
    setEntries(
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    closeEditModal();
  };

  useEffect(() => {
    axios
      .get(`${APIURL}/api/entries`)
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => console.error("Error fetching passwords:", error));
  }, []);

  const deleteEntry = (id: typeof uuid) => {
    axios
      .delete(`${APIURL}/api/entries/${id}`)
      .then(() => {
        const updatedEntries = entries.filter((entry) => entry.id != id);
        setEntries(updatedEntries);
      })
      .catch((error) => console.error("Error adding password:", error));
  };

  return (
    <div className="entries">
      <div id="entries-head">
        <div id="entries-head-left">
          <h2>Entries</h2>
          <Searchbar query={searchQuery} setQuery={setSearchQuery} />
        </div>
        <button id="openNewEntryModal" onClick={openNewEntryModal}>
          New
        </button>
        <NewEntryModal
          isOpen={isNewEntryModalOpen}
          onClose={closeNewEntryModal}
        />
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
                  openEditModal(entry);
                }}
              >
                Edit
              </button>
              <button onClick={() => deleteEntry(entry.id)}>Delete</button>
            </div>
          </div>
        ))}
      </ul>
      {isEditEntryModalOpen && currentEntry && (
        <EditEntryModal
          isOpen={isEditEntryModalOpen}
          entry={currentEntry}
          onClose={closeEditModal}
          onSave={saveEditedEntry}
        />
      )}
    </div>
  );
};

export default Entries;
