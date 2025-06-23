import React from 'react';
import { useState } from 'react';
import Modal, { ModalProps } from '../Modal';
import axios from '../../../API/axios';
import { Entry } from '../../../types';
import '../Modal.css';
import { faCopy, faCheck, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface EditEntryProps extends ModalProps {
	entry: Entry;
	onConfirm: (updatedEntry: Entry) => void;
}

const EditEntryModal: React.FC<EditEntryProps> = ({ isOpen, onClose, entry, onConfirm }) => {
	const [currentEntry, setCurrentEntry] = useState<Entry>({
		id: entry.id,
		service: entry.service,
		user: entry.user,
		password: entry.password,
		iv: entry.iv,
	});

	const [type, setType] = useState('password');
	const [eyeIcon, setEyeIcon] = useState(faEye);
	const [copyIcon, setCopyIcon] = useState(faCopy);

	const togglePasswordVisibility = () => {
		if (type === 'password') {
			setType('text');
			setEyeIcon(faEyeSlash);
		} else {
			setType('password');
			setEyeIcon(faEye);
		}
	};

	const handleCopyPassword = () => {
		navigator.clipboard.writeText(currentEntry.password);
		setCopyIcon(faCheck);
		setTimeout(() => {
			setCopyIcon(faCopy);
		}, 1500);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Edit Entry">
			<section className="inputs">
				<div className="input-group">
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
				</div>

				<div className="input-group">
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
				</div>

				<div className="input-group">
					<label htmlFor="password">Password:</label>
					<input
						id="password"
						type={type}
						value={currentEntry.password}
						onChange={(e) => {
							setCurrentEntry({ ...currentEntry, password: e.target.value });
						}}
						placeholder="Enter password"
					/>
					<button
						type="button"
						className="password-copy"
						onClick={() => {
							handleCopyPassword();
						}}>
						<FontAwesomeIcon icon={copyIcon} />
					</button>
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="password-toggle">
						<FontAwesomeIcon icon={eyeIcon} />
					</button>
				</div>

				<button
					onClick={() => onConfirm(currentEntry)}
					type="submit"
					disabled={
						!currentEntry.service.trim() ||
						!currentEntry.password.trim() ||
						!currentEntry.user.trim()
					}>
					Confirm
				</button>
			</section>
		</Modal>
	);
};

export default EditEntryModal;
