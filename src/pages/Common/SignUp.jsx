// src/components/SignUp.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice';
import { register } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/PopUp/PopUp';
import './SignUp.css';

const SignUp = ({ onSwitchToSignIn, onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [userType, setUserType] = useState('CUSTOMER');
    const [error, setError] = useState({});
    const [popUp, setPopUp] = useState({ visible: false, message: '', type: '', redirect: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validate = () => {
      const newErrors = {};

      if (!firstName) newErrors.firstName = 'First name is required';
      if (!lastName) newErrors.lastName = 'Last name is required';
      if (!email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
      else if (!email.endsWith('@nucleusteq.com')) newErrors.email = 'Email must end with @nucleusteq.com';
      // if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        // Contact number validation
        if (!contactNumber) {
          newErrors.contactNumber = 'Contact number is required';
      } else if (!/^\d{10}$/.test(contactNumber)) {
          newErrors.contactNumber = 'Contact number must be exactly 10 digits';
      } else if (!/^986/.test(contactNumber)) {
          newErrors.contactNumber = 'Contact number must start with 986';
      }

      // Password validation
      if (!password) {
        newErrors.password = 'Password is required';
    } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
    }

      setError(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        const encodedPassword = btoa(password);
        const response = await register({
          firstName,
          lastName,
          contactNumber,
          email,
          password: encodedPassword,
          role: userType,
        });
        const { userId, role, walletBalance } = response.data;

        dispatch(setUser({ userId, firstName, lastName, contactNumber, email, role, walletBalance }));
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);

        setPopUp({
          visible: true,
          message: 'Registration Successful',
          type: 'success',
          redirect: role === 'CUSTOMER' ? '/dashboard' : '/create-restaurant',
        });
      }  catch (error) {
        const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
        setPopUp({ visible: true, message: errorMessage, type: 'error', redirect: '' });
  ;
      }
    };

    const handlePopupClose = () => {
      setPopUp({ ...popUp, visible: false });
      if (popUp.type === 'success' && popUp.redirect) {
        navigate(popUp.redirect);
        onClose();
      }
    };

    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="form-group-name">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
                {error.firstName && <span className="error">{error.firstName}</span>}
              </div>
              <div className="form-group-name">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
                {error.lastName && <span className="error">{error.lastName}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact No.</label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
              {error.contactNumber && <span className="error">{error.contactNumber}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@nucleusteq.com"
              />
              {error.email && <span className="error">{error.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              {error.password && <span className="error">{error.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              {error.confirmPassword && <span className="error">{error.confirmPassword}</span>}
            </div>
            <div className="form-group">
              <label>I am a:</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="CUSTOMER"
                    checked={userType === 'CUSTOMER'}
                    onChange={() => setUserType('CUSTOMER')}
                  />
                  <span className="radio-custom"></span>
                  Customer
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="RESTAURANT_OWNER"
                    checked={userType === 'RESTAURANT_OWNER'}
                    onChange={() => setUserType('RESTAURANT_OWNER')}
                  />
                  <span className="radio-custom"></span>
                  Restaurant Owner
                </label>
              </div>
            </div>
            <button type="submit" className="submit-btn">Register</button>
          </form>
          
      {popUp.visible && (
          <Popup
            isOpen={popUp.visible}
            type={popUp.type}
            message={popUp.message}
            onClose={handlePopupClose}
          />
        )}
          <p>
            Already have an account?{' '}
            <a href="#" onClick={onSwitchToSignIn}>Sign In</a>
          </p>
        </div>
      </div>
    );
};

export default SignUp;
