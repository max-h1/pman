import { useState } from 'react';
import axios from '../../../API/axios';
import Modal from '../Modal';
import { ModalProps } from '../Modal';
import { Entry } from '../../../types';

interface NewEntryProps extends ModalProps {
	onConfirm: (newEntry: Entry) => void;
}

const NewEntryModal: React.FC<NewEntryProps> = ({ isOpen, onClose, onConfirm }) => {
	const [newEntry, setNewEntry] = useState<Entry>({
		id: 0,
		service: '',
		user: '',
		password: '',
		iv: '',
	});

	const clearFields = () => {
		setNewEntry({
			id: 0,
			service: '',
			user: '',
			password: '',
			iv: '',
		});
	};

	return (
		<Modal
			title="New Entry"
			isOpen={isOpen}
			onClose={onClose}>
			<section className="inputs">
				<div className="input-group">
					<label htmlFor="service">Service:</label>
					<input
						id="service"
						type="text"
						value={newEntry.service}
						onChange={(e) => setNewEntry({ ...newEntry, service: e.target.value })}
					/>
				</div>

				<div className="input-group">
					<label htmlFor="username">Username:</label>
					<input
						id="username"
						type="text"
						value={newEntry.user}
						onChange={(e) => setNewEntry({ ...newEntry, user: e.target.value })}
					/>
				</div>

				<div className="input-group">
					<label htmlFor="password">Password:</label>
					<input
						id="password"
						type="password"
						value={newEntry.password}
						onChange={(e) => setNewEntry({ ...newEntry, password: e.target.value })}
					/>
				</div>

				<button
					type="submit"
					onClick={() => {
						clearFields();
						onConfirm(newEntry);
					}}
					disabled={!newEntry.service.trim() || !newEntry.password.trim() || !newEntry.user.trim()}>
					Confirm
				</button>
			</section>
		</Modal>
	);
};

export default NewEntryModal;
