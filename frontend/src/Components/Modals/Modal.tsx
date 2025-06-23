import './Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export interface ModalProps {
	title?: string;
	isOpen: boolean;
	onClose: (arg?: any) => void;
	children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
	if (!isOpen) return null;
	return (
		<div className="modal-overlay">
			<div
				className="modal-content"
				onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<b id="title">{title}</b>
					<button
						className="close-button"
						onClick={onClose}>
						<FontAwesomeIcon icon={faClose} />
					</button>
				</div>

				{children}
			</div>
		</div>
	);
};

export default Modal;
