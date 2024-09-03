import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <NavLink to="/dashboard/orders" activeClassName="active-link">
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/update" activeClassName="active-link">
            Update Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" activeClassName="active-link">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/address" activeClassName="active-link">
            Address
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/option3" activeClassName="active-link">
            Option 3
          </NavLink>
        </li>
      </ul>
    </div>
  );
};


export default Sidebar;