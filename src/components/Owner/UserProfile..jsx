import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, updateWallet } from '../../utils/api';
import './userprofile.css';
import { FaPlus } from 'react-icons/fa';
import Toast from '../Toast.jsx/Toast';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState({
    firstName: 'Akash ',
    lastName: 'Ping',
    role: 'owner',
    email: 'asjhdkj@gmial.com',
    contactNumber: '9876634212',
    walletBalance: '1823',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [walletPopup, setWalletPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const { user } = useSelector((state) => state.auth);
  const userId = user?.userId;
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    if (!userId) {
      setError('User ID is missing');
      setLoading(false);
      return;
    }
    try {
      const response = await getUserProfile(userId);
      setUserProfile(response.data);
    } catch (error) {
      setError('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {userProfile?.firstName?.charAt(0)} {userProfile?.lastName?.charAt(0)}
        </div>
        <h1>{[userProfile?.firstName, userProfile?.lastName].join(' ')}</h1>
        {/* <p className="role">{userProfile?.role}</p> */}
      </div>
      <div className="profile-body">
        <div className="profile-info">
          <label>Email</label>
          <p>{userProfile?.email}</p>
        </div>
        <div className="profile-info">
          <label>Contact Number</label>
          <p>{userProfile?.contactNumber}</p>
        </div>
        <div className="profile-info">
          <label>Wallet Balance</label>
          <p className="balance">₹{userProfile?.walletBalance} <FaPlus onClick={() => setWalletPopup(true)} className="plus-icon"/></p>
        </div>
      </div>
      <div className="profile-footer">
        <button onClick={() => setShowPopup(true)} className="edit-button-profile">
          Edit Profile
        </button>
      </div>
      {showPopup && <UpdateProfileForm profile={userProfile} onClose={() => setShowPopup(false)}  onSave={()=>{
        setShowToast(true);
        setToastMessage('Profile updated successfully');
        setToastType('success');
        setShowPopup(false);
        fetchUserProfile();
        }} />}
        {
          showToast && <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
        }
        {
          walletPopup && <UpdateWalletForm profile={userProfile} onClose={() => setWalletPopup(false)}  onSave={(message)=>{
            setShowToast(true);
            setToastMessage(message);
            setToastType('success');
            setWalletPopup(false);
            fetchUserProfile();}}/>
        }
    </div>
  );
};

const UpdateProfileForm = ({ profile, onClose, onSave}) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [contactNumber, setContactNumber] = useState(profile.contactNumber);
  const [email, setEmail] = useState(profile.email);
  const userData = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState('');
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUpdate = () => {
    updateUserProfile(userData.userId, { firstName, lastName, contactNumber, email }).then(() => {
      
      onSave();
    }).catch((error) => {
      // console.error('Error updating profile:', error);
      
      setMessage(error.response.data);
    });
  };
  return (
    <>
    <div className="modal-overlay">
            <div className="modal-content">
    <form  onSubmit={handleSubmit}>
      <label>
        First Name
      </label>
      <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      {message.firstName && <p className="error">{message?.firstName}</p>}
      <label>
        Last Name
      </label>
      <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      {message.lastName && <p className="error">{message?.lastName}</p>}
      <label>
        Contact Number
      </label>
      <input
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
      {message.contactNumber && <p className="error">{message?.contactNumber}</p>}
      <label>
        Email
      </label>
      <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      {message.email && <p className="error">{message?.email}</p>}
      <div className='modal-actions'>
      <button className='success-button' onClick={handleUpdate}>Update Profile</button>
      <button className='cancel-button' onClick={onClose}>Cancel</button>
      </div>
    </form>
    </div>
    </div>
      </>
  );
};


const UpdateWalletForm = ({ profile, onClose, onSave}) => {
  const [walletBalance, setWalletBalance] = useState();
  const userData = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };  

  const handleUpdate = () => {
    updateWallet(userData.userId, { newBalance: parseFloat(walletBalance) + parseFloat(profile.walletBalance) }).then((response) => {
      onSave(response.data.message);
    }).catch((error) => {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    });
  };  

  return (
    <div className="modal-overlay">
            <div className="modal-content">
    <form onSubmit={handleSubmit}>
      <label>
        Wallet Balance
        <div>
        <input
          type="number"
          value={walletBalance}
          onChange={(e) => setWalletBalance(e.target.value)}
        />
        </div>
      </label>
      <div className='modal-actions'>
      <button className='success-button' onClick={handleUpdate}>Update Wallet</button> 
      <button className='cancel-button' onClick={onClose}>Cancel</button>
      </div>
    </form>
    </div>
    </div>
  );
};

export default UserProfile;

