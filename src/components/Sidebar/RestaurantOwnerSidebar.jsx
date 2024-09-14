import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaHome } from 'react-icons/fa';

const Sidebar = ({restaurantId}) => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <NavLink to="/admin/restaurants" >&larr; Back</NavLink>
        </li>
        <li>
          <NavLink to={`/admin/restaurants/${restaurantId}/dashboard`} className={location.pathname === `/admin/restaurants/${restaurantId}/dashboard` ? 'active-link' : undefined}>
            <FaHome />Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/restaurants/${restaurantId}/categories`} className={location.pathname === `/admin/restaurants/${restaurantId}/categories` ? 'active-link' : undefined}>
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/restaurants/${restaurantId}/orders`} className={location.pathname === `/admin/restaurants/${restaurantId}/orders` ? 'active-link' : undefined}>
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/restaurants/${restaurantId}/menu`} className={location.pathname === `/admin/restaurants/${restaurantId}/menu` ? 'active-link' : undefined}>
            Menu
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

