import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';
import Toast from '../../components/Toast.jsx/Toast';
import MenuItemCard from '../../components/CardComponent/MenuItemCard';
import CategoryDropdowns from '../../components/DropdownCategory/CategoryDropdowns';
import AuthModal from '../../components/AuthModal/AuthModal';
import defaultImage from '../../assets/restaurant_default.jpg';



const RestaurantPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const userId = localStorage.getItem('userId');
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success');
    const [toastMessage, setToastMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                const restaurantResponse = await axios.get(`http://localhost:8081/api/restaurants/getRestaurant/?id=${id}`);
                setRestaurant(restaurantResponse.data);

                const menuResponse = await axios.get(`http://localhost:8081/api/menuItems/${id}/menuItemsByRestaurant`);
                setMenuItems(menuResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching restaurant or menu items", error);
                setError("Error fetching data");
                setLoading(false);
            }
        };

        fetchRestaurantAndMenu();
        if (userId) {
            fetchCartData();
        }
    }, [id]);

    const fetchCartData = async () => {
        try {
            const response = await axios.get(`http://localhost:8083/api/cart/${userId}/userCart`);
            setCart(response?.data);
            
        } catch (error) {
            console.error("Error fetching cart data", error);
            setError("Error fetching cart data");
        }
    };

    const handleAddToCart = async (foodItemId) => {
        try {
            if (!userId) {
                setIsOpen(true);
                return;
            }
            const cartData = {
                userId: parseInt(userId),
                restaurantId: parseInt(id),  // The restaurant ID from the route params
                foodItemId: foodItemId,
                quantity: 1  // You can adjust this or add logic to change the quantity
            };

            const response = await axios.post('http://localhost:8083/api/cart/add', cartData);
            fetchCartData();
            setShowToast(true);
            setToastType('success');
            setToastMessage(response?.data?.message);
        } catch (error) {
            console.error('Error adding item to cart', error);
            setShowToast(true);
            setToastType('error');
            setToastMessage(error?.response?.data?.message);
        }
    };

    // Function to update the cart (increase, decrease quantity, or delete if quantity = 0)
    const onUpdateCart = async (cartId, newQuantity) => {
        try {
            if (newQuantity === 0) {
                await axios.delete(`http://localhost:8083/api/cart/${userId}/delete/${cartId}`);
                setShowToast(true);
                setToastType('success');
                setToastMessage('Item removed from cart');
            } else {
                await axios.put(`http://localhost:8083/api/cart/${cartId}/update`, {
                    newQuantity: newQuantity
                });
            }
            fetchCartData();
        } catch (error) {
            console.error('Error updating cart', error);
            setShowToast(true);
            setToastType('error');
            setToastMessage('Error updating cart');
        }
    };

    const handleCategorySelect = (fetchedMenuItems) => {
        setMenuItems(fetchedMenuItems);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="restaurant-page">
            {/* Restaurant Banner */}
            {restaurant && (
                <div className="restaurant-banner">
                    <img 
                        src={restaurant.imageUrl ? `data:image/jpeg;base64,${restaurant.imageUrl}` : defaultImage} 
                        alt={restaurant.restaurantName} 
                        className="restaurant-banner-image" 
                    />
                    <div className="restaurant-banner-content">
                        <h1 className="restaurant-name">{restaurant.restaurantName}</h1>
                        <p className='restaurant-description'>{restaurant.description}</p>
                        <p className="restaurant-hours">Opening Hours: {restaurant.openingHours}</p>
                        <p className='restaurant-address'>{restaurant.address}</p>
                        <p className='restaurant-contact'>{restaurant.contactNo}</p>
                    </div>
                </div>
            )}

            {/* Menu Items Section */}
            <header className="restaurant-header-page">
                <h2>Menu Items</h2>
                {/* Category Dropdown aligned to the right */}
                <CategoryDropdowns restaurantId={id} onCategorySelect={handleCategorySelect} />
            </header>

            <div className="menu-items-container">
                {menuItems?.map(item => (
                   <MenuItemCard 
                       key={item.id} 
                       menuItem={item} 
                       cartItems={cart?.cartItems} 
                       onAddToCart={handleAddToCart} 
                       onUpdateCart={onUpdateCart}  // Pass the update function
                   />
                ))}
            </div>
            <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            {showToast && (<Toast type={toastType} message={toastMessage} onClose={() => setShowToast(false)}  />)}
        </div>
    );
};

export default RestaurantPage;
