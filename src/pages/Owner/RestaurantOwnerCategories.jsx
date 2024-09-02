import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RestaurantOwnerDashboard.css';
import RestaurantOwnerDashboardSidebar from '../../components/Sidebar/RestaurantOwnerSidebar';
import { getRestaurantByUserId } from '../../utils/api';
import RestaurantCategories from '../../components/Categories/RestaurantCategories';

const RestaurantOwnerCategories = () => {
  const [restaurant, setRestaurant] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRestaurantData = async () => {
        try {
            getRestaurantByUserId(userId).then((data) => {
                setRestaurant(data);
            })
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
        }
    };
    fetchRestaurantData();
}, [userId]);

  return (
    <div className="dashboard-container">
      <RestaurantOwnerDashboardSidebar restaurantId={restaurant?.id} />
      <div className="dashboard-content">
        <RestaurantCategories restaurant={restaurant}/>
      </div>
    </div>
  );
};

export default RestaurantOwnerCategories;
