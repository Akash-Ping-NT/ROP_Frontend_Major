import React, { useState } from 'react';
import './RestaurantOrders.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { cancelOrderByOrderId, updateOrderStatus } from '../../utils/api';
import Toast from '../Toast.jsx/Toast';

const RestaurantOrders = ({ orderData, setShowToast, setToastType, setToastMessage }) => {
   
    const [status, setStatus] = useState(orderData.status);
    const userId = useSelector((state) => state.auth.user.userId);
    // const [showToast, setShowToast] = useState(false);
    // const [toastType, setToastType] = useState('success');
    // const [toastMessage, setToastMessage] = useState('');

    const handleStatusChange = async (newStatus) => {
        const previousStatus = status;
        setStatus(newStatus);
        try {
            const response = await updateOrderStatus(orderData.id, newStatus, userId);
            
        } catch (error) {
            setStatus(previousStatus);
            setShowToast(true);
            setToastType('error');
            setToastMessage(error.response?.data?.message || 'Error updating order status');
        }
    };

    const handleCancelOrder = async (orderId) => {
        const response = await cancelOrderByOrderId(orderId, userId);
        if (response.success) {
            setStatus("CANCELLED");
            setShowToast(true);
            setToastType('success');
            setToastMessage(response?.message);

        } else {
            console.error('Error cancelling order:', response.error);
            setShowToast(true);
            setToastType('error');
            setToastMessage(response.error);
        }
    };

    return (
        <div className="order-card">
            <div className="order-header">
            <h2>Order #{orderData.id}</h2>
            <p><strong>Customer Name:</strong> {orderData.firstName} {orderData.lastName}</p>
            <p><strong>Delivery Address:</strong> {orderData.deliveryAddress}</p>
            <p><strong>Order Date:</strong> {new Date(orderData.orderDate).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₹ {orderData.totalAmount.toFixed(2)}</p>
            </div>
            <div className="order-items">
            <h3>Order Items</h3>
            <ul>
                {orderData.orderItems.map((item) => (
                    <li key={item.foodItemId}>
                        {item.foodItemName} - {item.quantity} x ₹ {item.price} = ₹ {item.totalPrice.toFixed(2)}
                    </li>
                ))}
            </ul>

            {status !== 'CANCELLED' && status !== 'COMPLETED' && (
                    <div className="order-status">
                        <label htmlFor="status-select">Change Status: &nbsp;
                            <select
                                id="status-select"
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PREPARING">Preparing</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </label>

                        {/* Show the cancel button only if the status is not COMPLETED */}
                        {status !== 'COMPLETED' && (
                            <button className="cancel-button" onClick={() => handleCancelOrder(orderData.id)}>
                                Cancel Order
                            </button>
                        )}
                    </div>
                )}
                {status === 'CANCELLED' && (
                    <p className="cancelled-message">Order Cancelled</p>
                )}
                {status === 'COMPLETED' && (
                    <p className="completed-message">Order Completed</p>
                )}
            </div>
            {/* {showToast && ( <Toast type={toastType} message={toastMessage} onClose={() => setShowToast(false)} />)} */}
        </div>
    );
};

export default RestaurantOrders;
