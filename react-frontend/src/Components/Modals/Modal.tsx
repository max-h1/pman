import "./Modal.css";

export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <b id="title">{title}</b>
          <button className="close-button" onClick={onClose}>
            x
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
