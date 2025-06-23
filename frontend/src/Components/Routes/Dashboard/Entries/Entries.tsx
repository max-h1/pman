import axios from '../../../../API/axios';
import { useState, useEffect } from 'react';
import './Entries.css';
import Searchbar from '../Searchbar/Searchbar';
import NewEntryModal from '../../../Modals/NewEntryModal/NewEntryModal';
import EditEntryModal from '../../../Modals/EditEntryModal/EditEntryModal';
import { Entry } from '../../../../types';
import {
	ABtoB64,
	ABtoStr,
	B64toAB,
	decryptAES,
	encryptAES,
	encryptEntry,
	decryptEntry,
	strtoAB,
} from '../../../../Utils/Encryption';
import { useAuth } from '../../../Hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faVault } from '@fortawesome/free-solid-svg-icons';
import { RiShieldKeyholeFill } from 'react-icons/ri';
// import { AxiosResponse } from 'axios';

const Entries = () => {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false);
	const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
	const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
	const { symkey } = useAuth();

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

	const saveEditedEntry = async (updatedEntry: Entry) => {
		if (symkey) {
			// Encrypt the updated password
			let encryptedEntry = await encryptEntry(updatedEntry, symkey);

			// Send the encrypted entry to the server
			axios
				.put(`/api/entries/${encryptedEntry.id}`, encryptedEntry, {
					withCredentials: true,
				})
				.then(() => {
					// Update the local state with the unencrypted entry
					setEntries(entries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
					closeEditModal();
				})
				.catch((error) => console.error('Error editing entry:', error));
		} else {
			alert('Error editing entry: Symmetric key not found');
		}
	};

	const saveNewEntry = async (newEntry: Entry) => {
		if (symkey) {
			// Encrypt the new password
			let encryptedEntry: Entry = await encryptEntry(newEntry, symkey);

			axios
				.post(`/api/entries`, encryptedEntry, { withCredentials: true })
				.then((response) => {
					// Set server generated id to the new entry
					newEntry.id = response?.data?.id;

					// Update the local state with the unencrypted entry
					setIsNewEntryModalOpen(false);
					setEntries([...entries, newEntry]);
				})
				.catch((error) => console.error('Error adding entry:', error));
		} else {
			alert('Error adding entry: Symmetric key not found');
		}
	};

	useEffect(() => {
		axios
			.get(`/api/entries`, { withCredentials: true })
			.then(async (response) => {
				if (symkey) {
					let decryptedEntries = await Promise.all(
						(response.data as Entry[]).map(async (entry) => {
							return await decryptEntry(entry, symkey);
						})
					);
					setEntries(decryptedEntries);
				} else {
					alert('Error fetching entries: Symmetric key not found');
				}
			})
			.catch((error) => {
				console.error('Error fetching entries:', error);
			});
	}, []);

	const deleteEntry = (id: number) => {
		axios
			.delete(`/api/entries/${id}`, { withCredentials: true })
			.then(() => {
				const updatedEntries = entries.filter((entry) => entry.id != id);
				setEntries(updatedEntries);
			})
			.catch((error) => console.error('Error deleting entry:', error));
	};

	return (
		<div className="entries">
			<div id="entries-head">
				<div id="entries-head-left">
					<RiShieldKeyholeFill className="vault-icon" />
					<h2>All Vaults</h2>
					<Searchbar
						query={searchQuery}
						setQuery={setSearchQuery}
					/>
				</div>
				<button
					id="openNewEntryModal"
					onClick={openNewEntryModal}>
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
						<div
							className="entry"
							key={index}>
							<div className="entry-left">
								<FontAwesomeIcon
									icon={faGlobe}
									color="grey"
									size="xl"
								/>
								<div className="entry-info">
									<button
										className="entry-service"
										onClick={() => {
											openEditModal(entry);
										}}>
										{entry.service}
									</button>
									{/* <b className="entry-service">{entry.service}</b> */}
									<p className="entry-user">{entry.user}</p>
								</div>
							</div>

							<button
								onClick={() => deleteEntry(entry.id)}
								className="entry-delete">
								<FontAwesomeIcon icon={faTrash} />
							</button>
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
