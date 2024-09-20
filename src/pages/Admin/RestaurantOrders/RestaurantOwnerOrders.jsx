import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './RestaurantOwnerOrders.css';
import RestaurantOwnerDashboardSidebar from '../../../components/Sidebar/RestaurantOwnerSidebar';
import RestaurantDashboard from '../../../components/Owner/RestaurantDashboard';
import { getRestaurantByRestaurantId, getRestaurantByUserId } from '../../../utils/api';
import RestaurantOrders from '../../../components/Owner/RestaurantOrders';
import Toast from '../../../components/Toast.jsx/Toast';

const RestaurantOwnerOrders = () => {
  const [restaurant, setRestaurant] = useState({});
  const userId = localStorage.getItem('userId');
  const [ordersData, setOrdersData] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

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



useEffect(() => {
  if (restaurant && restaurant.id) {
    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:8083/api/orders/restaurant/?restaurantId=${restaurant.id}`);
            if (response.ok) {
                const data = await response.json();
                setOrdersData(data); // Store the fetched data in state
            } else {
                const data = await response.json();
                setToastMessage(data.message);
                setToastType('error');
                setShowToast(true);
                console.error('Failed to fetch orders data');
            }
        } catch (error) {
            console.error('Error fetching orders data:', error);
        }
    };

    fetchOrders();
  }
}, [restaurant]);

  return (
    <div className="dashboard-container">
      <RestaurantOwnerDashboardSidebar restaurantId={restaurant.id} />
      <div className="dashboard-content">
      <div>
        {ordersData.length === 0 && (
            <p>No orders found.</p>
        )
        }
            {ordersData.map((order) => (
                <RestaurantOrders key={order.id} orderData={order} />
            ))}
        </div>
      </div>
      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default RestaurantOwnerOrders;
