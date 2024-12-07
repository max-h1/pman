import axios from "../../API/axios";
import { useState, useEffect } from "react";
import "./Entries.css";
import Searchbar from "../Searchbar/Searchbar";
import NewEntryModal from "../Modals/NewEntryModal/NewEntryModal";
import EditEntryModal from "../Modals/EditEntryModal/EditEntryModal";
import { Entry } from "../../types";

const Entries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);

  const filterSearch = (entry: Entry) => {
    return entry.service.includes(searchQuery);
  };

  const sortByService = (a: Entry, b: Entry): number => {
    return a.service > b.service ? 1 : -1;
  };

  const openNewEntryModal = () => setIsNewEntryModalOpen(true);

  const closeNewEntryModal = () => {
    setIsNewEntryModalOpen(false);
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
    axios
      .put(`/api/entries/${updatedEntry.id}`, updatedEntry, {
        withCredentials: true,
      })
      .catch((error) => console.error("Error editing password:", error));
    setEntries(
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    closeEditModal();
  };

  const saveNewEntry = (newEntry: Entry) => {
    
    axios
      .post(`/api/entries`, newEntry, { withCredentials: true })
      .then((response) => {
        newEntry.id = response?.data?.id;
      })
      .catch((error) => console.error("Error adding password:", error));

    setEntries([...entries, newEntry]);
    setIsNewEntryModalOpen(false);
  };

  useEffect(() => {
    axios
      .get(`/api/entries`, { withCredentials: true })
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching passwords:", error);
      });
  }, []);

  const deleteEntry = (id: number) => {
    axios
      .delete(`/api/entries/${id}`, { withCredentials: true })
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
          onConfirm={saveNewEntry}
        />
      </div>
      <ul>
        {entries
          .sort(sortByService)
          .filter(filterSearch)
          .map((entry, index) => (
            <div className="entry" key={index}>
              <div className="entry-info">
                <b>{entry.service}</b> | User: {entry.user}
              </div>
              <div className="entry-options">
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
          onConfirm={saveEditedEntry}
        />
      )}
    </div>
  );
};

export default Entries;
