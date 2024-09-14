import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [lineWidth, setLineWidth] = useState('100%'); // Start with the line at 100%

  useEffect(() => {
    // Show the toast initially
    setVisible(true);

    // Start the timer line as soon as the toast becomes visible
    setLineWidth('100%');
    const lineTimer = setTimeout(() => {
      setLineWidth('0%'); // Shrink the line over 3 seconds
    }, 50); // Start shrinking almost immediately after toast appears

    // Set timer to hide the toast after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false); // Begin hiding the toast
    }, 3000);

    // Set another timer to trigger the onClose after fade-out animation
    const cleanupTimer = setTimeout(() => {
      onClose();
    }, 3500); // Wait for the fade-out transition to complete

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
      clearTimeout(lineTimer);
    };
  }, [onClose]);

  return (
    <div className={`toast ${visible ? 'show' : 'hide'} ${type}`}>
      <p>{message}</p>
      <div 
        className={`toast-underline ${type}`} 
        style={{ width: lineWidth }} // The width decreases over time
      />
    </div>
  );
};

export default Toast;
