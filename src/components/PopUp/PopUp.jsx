import React from 'react';
import './Popup.css';
import { useNavigate } from 'react-router-dom';

const Popup = ({ message, onClose, type, redirect }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    onClose();
    if (redirect) {
      navigate(redirect);
    }
  };

  return (
    <div className="popup-overlay" aria-live="assertive" role="dialog">
      <div className={`popup-container ${type}`}>
        <h2>{type === 'success' ? 'Success' : 'Error'}</h2>
        <p>{message}</p>
        <button
          onClick={handleOkClick}
          className="popup-btn"
          aria-label="Close"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
