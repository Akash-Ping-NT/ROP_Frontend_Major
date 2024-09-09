import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './RestaurantOwnerMenu.css';
import RestaurantOwnerDashboardSidebar from '../../../components/Sidebar/RestaurantOwnerSidebar';
import { getRestaurantByRestaurantId, getRestaurantByUserId } from '../../../utils/api';
import RestaurantMenu from '../../../components/RestaurantMenu/RestaurantMenu';

const RestaurantOwnerMenu = () => {
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
}, [id]);

  return (
    <div className="dashboard-container">
      <RestaurantOwnerDashboardSidebar restaurantId={restaurant.id} />
      <div className="dashboard-content">
        {restaurant && <RestaurantMenu restaurant={restaurant}/>}
      </div>
    </div>
  );
};

export default RestaurantOwnerMenu;
