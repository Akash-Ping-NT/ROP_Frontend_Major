import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './RestaurantOwnerRestaurants.css';
import RestaurantOwnerDashboardSidebar from '../../../components/Sidebar/RestaurantOwnerSidebar';
import RestaurantDashboard from '../../../components/Owner/RestaurantDashboard';
import { getRestaurantByRestaurantId, getRestaurantByUserId } from '../../../utils/api';

const RestaurantOwnerRestaurants = () => {
  const [restaurant, setRestaurant] = useState({});
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const fetchRestaurantData = async () => {
    try {
        getRestaurantByRestaurantId(id).then((data) => {
            setRestaurant(data);
        }).catch((error) => {
            console.error('Error fetching restaurant data:', error);
        })
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
    }
};

  useEffect(() => {
    fetchRestaurantData();
}, [userId, id]);

  return (
    <div className="dashboard-container">
      <RestaurantOwnerDashboardSidebar restaurantId={restaurant.id} />
      <div className="dashboard-content">
        <RestaurantDashboard 
        restaurant={restaurant}
        setRestaurant={setRestaurant} 
        refreshData={fetchRestaurantData} />
      </div>
    </div>
  );
};

export default RestaurantOwnerRestaurants;
