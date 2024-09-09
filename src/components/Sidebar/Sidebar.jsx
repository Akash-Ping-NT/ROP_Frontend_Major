import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <NavLink to="/dashboard" className={location.pathname === '/dashboard' ? 'active-link' : undefined}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/orders" activeClassName="active-link">
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/address" activeClassName="active-link">
            Address
          </NavLink>
        </li>
      </ul>
    </div>
  );
};


export default Sidebar;