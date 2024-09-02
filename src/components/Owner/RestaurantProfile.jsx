import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../utils/api';
import './userprofile.css';

const RestaurantProfile = () => {
  const [userProfile, setUserProfile] = useState({
    firstName: 'Anil ',
    lastName: 'Ping',
    role: 'owner',
    email: 'asjhdkj@gmial.com',
    contactNumber: '9876634212',
    // walletBalance: '1823',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.userId;
  const navigate = useNavigate();

  useEffect(() => {
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
        <p className="role">{userProfile?.role}</p>
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
        {/* <div className="profile-info">
          <label>Wallet Balance</label>
          <p className="balance">₹{userProfile?.walletBalance}</p>
        </div> */}
      </div>
      <div className="profile-footer">
        <button onClick={() => navigate('/update-profile')} className="edit-button">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default RestaurantProfile;
