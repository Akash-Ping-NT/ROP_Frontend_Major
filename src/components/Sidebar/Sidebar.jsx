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
          <NavLink to="/dashboard/orders" activeClassName="active-link">
            <FaReceipt size={20}/> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/address" activeClassName="active-link">
            <FaBuilding size={20}/> Address
          </NavLink>
        </li>
      </ul>
    </div>
  );
};


export default Sidebar;