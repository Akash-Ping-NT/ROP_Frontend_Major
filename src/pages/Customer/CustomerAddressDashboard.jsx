import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import UserAddress from '../../components/Address/UserAddress';
import './CustomerDashboard.css';
import UserProfile from '../../components/Owner/UserProfile.';

const CustomerAddressDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <UserAddress/>
      </div>
    </div>
  );
};

export default CustomerAddressDashboard;
