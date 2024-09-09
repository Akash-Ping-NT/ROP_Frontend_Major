import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';

const CartItemPage = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const { userId } = useSelector((state) => state.auth.user);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const response = await axios.get(`http://localhost:8083/api/cart/${userId}`);
            setCart(response.data.cartItems);
            calculateTotalPrice(response.data.cartItems);
        } catch (error) {
            console.error("Error fetching cart data", error);
            setError("Error fetching cart data");
        }
    };

    // Handle Increase Quantity
    const handleIncreaseQuantity = async (cartId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;
        try {
            await axios.put(`http://localhost:8083/api/cart/${cartId}/update`, {
                newQuantity: newQuantity
            });
            // Update cart state after successful API call
            fetchCartData();
        } catch (error) {
            console.error('Error updating quantity', error);
        }
    };

    // Handle Decrease Quantity or Delete Item if Quantity is 1
    const handleDecreaseQuantity = async (cartId, currentQuantity) => {
        if (currentQuantity === 1) {
            handleDeleteItem(cartId);
        } else {
            const newQuantity = currentQuantity - 1;
            try {
                await axios.put(`http://localhost:8083/api/cart/${cartId}/update`, {
                    newQuantity: newQuantity
                });
                // Update cart state after successful API call
                fetchCartData();
            } catch (error) {
                console.error('Error updating quantity', error);
            }
        }
    };

    // Handle Delete Item
    const handleDeleteItem = async (cartId) => {
        try {
            await axios.delete(`http://localhost:8083/api/cart/${userId}/delete/${cartId}`);
            // Update cart state after successful API call
            fetchCartData();
        } catch (error) {
            console.error('Error deleting item', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await axios.delete(`http://localhost:8083/api/cart/clear/${userId}`);
            fetchCartData();
        } catch (error) {
            console.error('Error clearing cart', error);
            setError('Error clearing cart');
        }
    };
    const handleCheckout = async () => {
        try {
            const response = await axios.post(`http://localhost:8083/api/cart/validate`, {
                userId: userId,
                totalPrice: totalPrice
            });
            console.log('Checkout successful', response.data);
            navigate('/checkout');


            // Handle post-checkout logic here, such as redirecting to a confirmation page
        } catch (error) {
            console.error('Error during checkout', error);
            setError(error.response.data.message);
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
                                    {item.quantity === 1 ? "Delete" : "-"}
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
        </div>
    );
};

export default CartItemPage;
