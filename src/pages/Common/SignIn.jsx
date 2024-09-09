import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/PopUp/PopUp';
import { login } from '../../utils/api';
import './SignIn.css';

const SignIn = ({ onSwitchToSignUp, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [popUp, setPopUp] = useState({
    visible: false,
    message: '',
    type: '',
    redirect: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const encodedPassword = btoa(password);
      const response = await login({
        email,
        password: encodedPassword,
      });

      if (response.status === 200) {
        const { userId, firstName, lastName, contactNumber, role, walletBalance } = response.data;

        dispatch(
          setUser({
            userId,
            firstName,
            lastName,
            contactNumber,
            email,
            role,
            walletBalance,
          })
        );

        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);

        setPopUp({
          visible: true,
          message: 'Sign In Successful',
          type: 'success',
          redirect: '', // Redirect will be handled in handlePopupClose
        });

      } else {
        setPopUp({
          visible: true,
          message: response.data.error || 'Invalid credentials',
          type: 'error',
          redirect: '',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid credentials';
      setPopUp({ visible: true, message: errorMessage, type: 'error', redirect: '' });

    }
  };

  const handlePopupClose = () => {
    setPopUp({ ...popUp, visible: false });
    if (popUp.type === 'success') {
      const role = localStorage.getItem('role');
      const redirectPath = role === 'CUSTOMER' ? '/dashboard' : '/admin/restaurants';
      navigate(redirectPath);
      onClose();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@nucleusteq.com"
              aria-describedby="email-error"
            />
            {errors.email && <span id="email-error" className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-describedby="password-error"
            />
            {errors.password && <span id="password-error" className="error">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>

        <p>
          Don't have an account?{' '}
          <a href="#" onClick={onSwitchToSignUp}>
            Sign Up
          </a>
        </p>
      </div>
      {popUp.visible && (
        <Popup
          message={popUp.message}
          onClose={handlePopupClose}
          type={popUp.type}
          redirect={popUp.redirect}
      />
      )}
    </div>
  );
}

export default SignIn;
