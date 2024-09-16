import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaBuilding, FaReceipt, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <NavLink to="/dashboard" className={location.pathname === '/dashboard' ? 'active-link' : undefined}>
            <FaUser size={20}/> Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/orders"  className={location.pathname === '/dashboard/orders' ? 'active-link' : undefined}>
            <FaReceipt size={20}/> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/address"  className={location.pathname === '/dashboard/address' ? 'active-link' : undefined}>
            <FaBuilding size={20}/> Address
          </NavLink>
        </li>
      </ul>
    </div>
  );
};


export default Sidebar;