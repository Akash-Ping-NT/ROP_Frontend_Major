import React, { useState } from 'react';
import './RestaurantOrders.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RestaurantOrders = ({ orderData }) => {
    const [status, setStatus] = useState(orderData.status);
    const userId = useSelector((state) => state.auth.user.userId);

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        try {
            await axios.put(`http://localhost:8083/api/orders/${orderData.id}/status`, { userId,newStatus: newStatus });
            console.log(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating order status', error);
        }
    };

    const handleCancelOrder = async (orderId) => {
            try {
                const response = await axios.put(`http://localhost:8083/api/orders/cancel/${orderId}?userId=${userId}`);
                if (response.status === 200) {
                    alert('Order cancelled successfully');
                } else {
                    console.error('Failed to cancel order');
                }
            } catch (error) {
                console.error('Error cancelling order:', error);
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

                {
                    status !== 'CANCELLED' &&
            <div className="order-status">
                <label htmlFor="status-select">Change Status:  &nbsp;
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
                <button className="cancel-button" onClick={()=>{handleCancelOrder(orderData.id)}}>
                    Cancel Order
                </button>
            </div>
                }
                {
                    status === 'CANCELLED' &&
            <p className="cancelled-message">Order Cancelled</p>
                }
                </div>
        </div>
    );
};

export default RestaurantOrders;
