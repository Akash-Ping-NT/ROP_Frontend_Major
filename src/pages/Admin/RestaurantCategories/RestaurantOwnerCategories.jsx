import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './RestaurantOwnerCategories.css';
import RestaurantOwnerDashboardSidebar from '../../../components/Sidebar/RestaurantOwnerSidebar';
import RestaurantCategories from '../../../components/Categories/RestaurantCategories';
import { getRestaurantByRestaurantId, getRestaurantByUserId } from '../../../utils/api';

const RestaurantOwnerCategories = () => {
  const [restaurant, setRestaurant] = useState({});
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
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
    fetchRestaurantData();
}, [userId]);

  return (
    <div className="dashboard-container">
      <RestaurantOwnerDashboardSidebar restaurantId={restaurant.id} />
      <div className="dashboard-content">
        {restaurant && <RestaurantCategories restaurant={restaurant}/>}
      </div>
    </div>
  );
};

export default RestaurantOwnerCategories;
