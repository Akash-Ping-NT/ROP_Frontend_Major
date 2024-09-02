// src/components/CustomerDashboard.js
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './CustomerDashboard.css';
import UserProfile from '../../components/Owner/UserProfile.';

const CustomerDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <UserProfile/>
      </div>
      <div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
