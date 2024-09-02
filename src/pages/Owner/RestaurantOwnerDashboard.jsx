import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RestaurantOwnerDashboard.css';
import RestaurantOwnerDashboardSidebar from '../../components/Sidebar/RestaurantOwnerSidebar';
import RestaurantDashboard from '../../components/Owner/RestaurantDashboard';
import { getRestaurantByUserId } from '../../utils/api';

const RestaurantOwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState({});
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantData = async () => {
        try {
            getRestaurantByUserId(userId).then((data) => {
                setRestaurant(data);
            }).catch((error) => {
                console.error('Error fetching restaurant data:', error);
                navigate('/create-restaurant')
            })
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
            navigate('/create-restaurant')

        }
    };
    fetchRestaurantData();
}, [userId]);

  return (
    <div className="dashboard-container">
      <RestaurantOwnerDashboardSidebar restaurantId={restaurant.id} />
      <div className="dashboard-content">
        <RestaurantDashboard restaurant={restaurant}/>
      </div>
    </div>
  );
};

export default RestaurantOwnerDashboard;
