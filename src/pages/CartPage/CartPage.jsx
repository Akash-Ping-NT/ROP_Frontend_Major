import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { clearCartForUser, deleteItemFromCartForUser, fetchCartDataForUser, updateQuantityInCartForUser, validateCartAndCheckout } from '../../utils/api';
import Toast from '../../components/Toast.jsx/Toast';

const CartItemPage = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const { userId } = useSelector((state) => state.auth.user);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success');
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const cartItems = await fetchCartDataForUser(userId);
            setCart(cartItems);
            calculateTotalPrice(cartItems);
        } catch (error) {
            console.error("Error fetching cart data", error);
            setError("Error fetching cart data");
            setShowToast(true);
            setToastType('error');
            setToastMessage("Error fetching cart data");
        }
    };

    // Handle Increase Quantity
    const handleIncreaseQuantity = async (cartId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;
        try {
            await updateQuantityInCartForUser(cartId, newQuantity, userId);
            // Update cart state after successful API call
            fetchCartData();
        } catch (error) {
            console.error('Error updating quantity', error);
            setShowToast(true);
            setToastType('error');
            setToastMessage(error.response.data.message);
        }
    };

    // Handle Decrease Quantity or Delete Item if Quantity is 1
    const handleDecreaseQuantity = async (cartId, currentQuantity) => {
        if (currentQuantity === 1) {
            handleDeleteItem(cartId);
        } else {
            const newQuantity = currentQuantity - 1;
            try {
                await updateQuantityInCartForUser(cartId, newQuantity, userId);
                // Update cart state after successful API call
                fetchCartData();
            } catch (error) {
                console.error('Error updating quantity', error);
                setShowToast(true);
                setToastType('error');
                setToastMessage(error.response.data.message);
            }
        }
    };

    // Handle Delete Item
    const handleDeleteItem = async (cartId) => {
        try {
            const res = await deleteItemFromCartForUser(cartId, userId);
            // Update cart state after successful API call
            fetchCartData();
            setShowToast(true);
            setToastType('success');
            setToastMessage(res.message);
        } catch (error) {
            console.error('Error deleting item', error);
            setShowToast(true);
            setToastType('error');
            setToastMessage(error.response.data.message);
        }
    };

    const handleClearCart = async () => {
        try {
            const response =await clearCartForUser(userId);
            fetchCartData();
            setShowToast(true);
            setToastType('success');
            setToastMessage(response.message);
        } catch (error) {
            console.error('Error clearing cart', error);
            setError(error.response.data.message);
            setShowToast(true);
            setToastType('error');
            setToastMessage(error.response.data.message);
        }
    };
    const handleCheckout = async () => {
        try {
            const response = await validateCartAndCheckout(userId, totalPrice);
            
            navigate('/checkout');

            // Handle post-checkout logic here, such as redirecting to a confirmation page
            setShowToast(true);
            setToastType('success');
            setToastMessage(response.message);
        } catch (error) {
            console.error('Error during checkout', error);
            setError(error.response.data.message);
            setShowToast(true);
            setToastType('error');
            setToastMessage(error.response.data.message);
            setTimeout(() => {
                setError(null);
                fetchCartData();
            },3000);
        }
    };

    // Calculate Total Price of Cart
    const calculateTotalPrice = (cartItems) => {
        const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setTotalPrice(total);
    };

    return (
        <div className="cart-page-container">
            <div className="cart-items-section">
                <div className='cart-header'>
                    <h2>Cart Items</h2>
                    <button onClick={handleClearCart} className="clear-cart-button">Clear Cart</button>
                </div>
                {cart.map(item => (
                    <div key={item.cartId} className="cart-item">
                        <img src={`data:image/jpeg;base64,${item.foodItemImage}`} alt={item.foodItemName} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h3>{item.foodItemName}</h3>
                            <p>Price: ₹ {item.price}</p>
                            <div className="cart-item-quantity">
                                <button 
                                    onClick={() => handleDecreaseQuantity(item.cartId, item.quantity)}
                                    className={item.quantity === 1 ? "delete-button" : "decrease-button"}
                                >
                                    {item.quantity === 1 ? <FaTrash/> : "-"}
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleIncreaseQuantity(item.cartId, item.quantity)} className="increase-button">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {
                    cart.length === 0 ? (
                        <div className="empty-cart-message">
                            <h2>Your cart is empty.</h2>
                            <p>Please add some items to your cart.</p>
                        </div>
                    ) : null
                }
            </div>

            <div className="cart-summary-section">
                <div className="cart-summary">
                    <h2>Price Details</h2>
                    <p>Total Price: ₹ {totalPrice.toFixed(2)}</p>
                    {error && <p className="error-message">{error}</p>}
                    <button onClick={handleCheckout} className="checkout-button">Checkout</button>
                </div>
            </div>
            {showToast && (
                <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
            )}
        </div>
    );
};

export default CartItemPage;
