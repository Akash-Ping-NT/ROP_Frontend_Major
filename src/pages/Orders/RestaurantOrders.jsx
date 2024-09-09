import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestaurantOrders.css'; // Import the CSS file
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const userId = useSelector(state => state.auth.user.userId); // Replace with dynamic userId if needed

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:8083/api/orders/user/${userId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching user orders:', error);
            }
        };

        fetchOrders();
    }, [userId]);

    const cancelOrder = async (orderId) => {
        try {
            const response = await axios.put(`http://localhost:8083/api/orders/cancel/${orderId}?userId=${userId}`);
            if (response.status === 200) {
                alert('Order cancelled successfully');
                setOrders(orders.map(order => order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order));
            } else {
                console.error('Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
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
    </div>
    );
};

export default RestaurantOrders;
