import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';


const Sidebar = ({restaurantId}) => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <NavLink to="/restaurant" activeClassName="active-link">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/restaurant/orders" activeClassName="active-link">
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to={`/restaurant/${restaurantId}/categories`} activeClassName="active-link">
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink to={`/restaurant/${restaurantId}/menu`} activeClassName="active-link">
            Menu
          </NavLink>
        </li>
        <li>
          <NavLink to={`/restaurant/restaurantOwnerProfile`} activeClassName="active-link">
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};


export default Sidebar;