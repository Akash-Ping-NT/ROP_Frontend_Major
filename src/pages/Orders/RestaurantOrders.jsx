import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestaurantOrders.css'; // Import the CSS file
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';
import { cancelOrderByOrderId, fetchOrdersForUser } from '../../utils/api';
import Toast from '../../components/Toast.jsx/Toast';

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const userId = useSelector(state => state.auth.user.userId); // Replace with dynamic userId if needed

    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success');
    const [toastMessage, setToastMessage] = useState('');


const fetchOrders = async () => {
    try {
        const data = await fetchOrdersForUser(userId);
        setOrders(data);
    } catch (error) {
        console.error('Error fetching user orders:', error);
    }
};

    useEffect(() => {
        fetchOrders();
    }, [userId]);

    // const cancelOrder = async (orderId) => {
    //     const { success, error } = await cancelOrder(orderId, userId);
    //     if (success) {
    //         alert('Order cancelled successfully');
    //         setOrders(orders.map(order => order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order));
    //         fetchOrders();
    //     } else {
    //         console.error('Error cancelling order:', error);
    //         alert(`Error cancelling order: ${error}`);
    //         fetchOrders();
    //     }
    // };

    const cancelOrder = async (orderId) => {
        const response = await cancelOrderByOrderId(orderId, userId);
        if (response.success) {
            setShowToast(true);
            setToastType('success');
            setToastMessage(response?.message);
            setOrders(orders.map(order => order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order));
            fetchOrders();
        } else {
            console.error('Error cancelling order:', response.error);
            setShowToast(true);
            setToastType('error');
            setToastMessage(response.error);
            fetchOrders();
        }
    };

    const calculateRemainingTime = (orderDate) => {
        const now = new Date();
        const orderTime = new Date(orderDate);
        const timeDifferenceInSeconds = 30 - Math.floor((now - orderTime) / 1000);
        return timeDifferenceInSeconds > 0 ? timeDifferenceInSeconds : 0;
    };

    const Timer = ({ orderDate, onExpire }) => {
        const [remainingTime, setRemainingTime] = useState(calculateRemainingTime(orderDate));

        useEffect(() => {
            const timerInterval = setInterval(() => {
                const newRemainingTime = calculateRemainingTime(orderDate);
                setRemainingTime(newRemainingTime);

                if (newRemainingTime === 0) {
                    clearInterval(timerInterval);
                    onExpire();
                }
            }, 1000);

            return () => clearInterval(timerInterval);
        }, [orderDate, onExpire]);

        return <span className="timer">Time left to cancel: {remainingTime} seconds</span>;
    };

    return (
        <div className="dashboard-container">
         <Sidebar />
      <div className="dashboard-content">
        <div className="user-orders-container">
            <h2>User Orders</h2>
            {orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.orderId} className="order-card">
                            <div className="order-header">
                            <h3 >Order #{order.orderId}</h3>
                            <p><strong>Restaurant:</strong> {order.restaurantName}</p>
                            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                            <p className="total-amount"><strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="order-items">
                                <h4>Items:</h4>
                                <ul>
                                    {order.orderItems.map((item) => (
                                        <li key={item.foodItemId}>
                                            {item.quantity} x {item.foodItemName} - ₹{item.totalPrice.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>

                            <div className={`order-status ${order.status.toLowerCase()}`}>
                                {order.status}
                            </div>
                            </div>

                            {calculateRemainingTime(order.orderDate) > 0 && order.status === 'PENDING' && (
                                <>
                                    <Timer
                                        orderDate={order.orderDate}
                                        onExpire={() => setOrders(orders.map(o => o.orderId === order.orderId ? { ...o, status: 'EXPIRED' } : o))}
                                    />
                                    <button onClick={() => cancelOrder(order.orderId)}>Cancel Order</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders available.</p>
            )}
        </div>
      </div>
      {showToast && (
        <Toast type={toastType} message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
    );
};

export default RestaurantOrders;
