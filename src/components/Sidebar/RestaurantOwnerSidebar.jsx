import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaHouseDamage, FaList, FaReceipt } from 'react-icons/fa';
import { FaBowlFood } from 'react-icons/fa6';

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
            <FaHome size={20}/> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/restaurants/${restaurantId}/categories`} className={location.pathname === `/admin/restaurants/${restaurantId}/categories` ? 'active-link' : undefined}>
            <FaList size={20} /> Categories
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/restaurants/${restaurantId}/orders`} className={location.pathname === `/admin/restaurants/${restaurantId}/orders` ? 'active-link' : undefined}>
            <FaReceipt size={20}/> Orders
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/restaurants/${restaurantId}/menu`} className={location.pathname === `/admin/restaurants/${restaurantId}/menu` ? 'active-link' : undefined}>
            <FaBowlFood size={20}/> Menu
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

