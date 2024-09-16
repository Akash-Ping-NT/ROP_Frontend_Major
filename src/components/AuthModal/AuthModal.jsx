// src/components/AuthModal.js
import React, { useState } from 'react';
import SignIn from '../../pages/Common/SignIn';
import SignUp from '../../pages/Common/SignUp';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignIn = (user) => {
    
    onClose();
  };

  const handleSignUp = (user) => {
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          &times;
        </button>
        {isSignIn ? (
          <SignIn onSignIn={handleSignIn} onClose={onClose} onSwitchToSignUp={() => setIsSignIn(false)} />
        ) : (
          <SignUp onSignUp={handleSignUp}   onClose={onClose}  onSwitchToSignIn={() => setIsSignIn(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
