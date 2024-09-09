import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Checkout.css';
import { getAllAddress } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const { userId } = useSelector((state) => state.auth.user);
    const [restaurantId, setRestaurantId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartData();
        fetchUserAddresses();
    }, []);

    const fetchCartData = async () => {
        try {
            const response = await axios.get(`http://localhost:8083/api/cart/${userId}`);
            setCart(response.data.cartItems);
            setRestaurantId(response.data.restaurantId);
            calculateTotalPrice(response.data.cartItems);
        } catch (error) {
            console.error("Error fetching cart data", error);
        }
    };

    const fetchUserAddresses = async () => {
        getAllAddress(userId).then(addresses => setAddresses(addresses));

    };

    const calculateTotalPrice = (cartItems) => {
        const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(total);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select an address to place the order.");
            return;
        }

        const orderPayload = {
            userId: userId,
            addressId: selectedAddress.addressId,
            cartIds: cart.map(item => item.cartId),
        };

        try {
            await axios.post('http://localhost:8083/api/orders/place', orderPayload);
            setOrderPlaced(true);
            setTimeout(() => {
                setOrderPlaced(false);
                navigate('dashboard/orders');
            },5000)
        } catch (error) {
            console.error('Error placing order', error);
            alert('Error placing order');
        }
    };

    if (orderPlaced) {
        return (
            <div className="order-placed-popup">
                <p>Your order has been placed!</p>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>

            {/* Select Address Section */}
            <div className="address-selection">
                <h3>Select Delivery Address</h3>
                {addresses.length > 0 ? (
                    addresses.map(address => (
                        <div key={address.addressId} className="address-option">
                            <input
                                type="radio"
                                id={`address-${address.addressId}`}
                                name="address"
                                value={address.id}
                                onChange={() => setSelectedAddress(address)}
                            />
                            <label htmlFor={`address-${address.addressId}`}>
                                {address.street}, {address.city}, {address.state}, {address.postalCode}
                            </label>
                        </div>
                    ))
                ) : (
                    <p>No addresses available. Please add an address.</p>
                )}
            </div>

            {/* Cart Items Section */}
            <div className="cart-items-section">
                <h3>Your Order</h3>
                {cart.map(item => (
                    <div key={item.foodItemId} className="cart-item">
                        <p>{item.foodItemName} - {item.quantity} x ₹ {item.price} = ₹ {item.totalPrice.toFixed(2)}</p>
                    </div>
                ))}
            </div>

            {/* Total Price Section */}
            <div className="total-price">
                <h3>Total: ₹ {totalPrice.toFixed(2)}</h3>
            </div>

            {/* Place Order Button */}
            <button onClick={handlePlaceOrder} className="place-order-button">
                Place Order
            </button>
        </div>
    );
};

export default Checkout;
