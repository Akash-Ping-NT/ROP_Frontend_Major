import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';
import MenuItemCard from '../../components/CardComponent/MenuItemCard';

const RestaurantPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                const restaurantResponse = await axios.get(`http://localhost:8081/api/restaurants/getRestaurant/${id}`);
                setRestaurant(restaurantResponse.data);

                const menuResponse = await axios.get(`http://localhost:8081/api/menuItems/menuItemsByRestaurant/${id}`);
                setMenuItems(menuResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching restaurant or menu items", error);
                setError("Error fetching data");
                setLoading(false);
            }
        };

        fetchRestaurantAndMenu();
        if(userId) {
            fetchCartData();
        }
    }, [id]);


    const fetchCartData = async () => {
        try {
            const response = await axios.get(`http://localhost:8083/api/cart/${userId}`);
            setCart(response.data);
            console.log("Cart data fetched successfully", response.data);
        } catch (error) {
            console.error("Error fetching cart data", error);
            setError("Error fetching cart data");
        }
    };


    const handleAddToCart = async (foodItemId) => {
        try {
            if(!userId) {   
                alert('Please login to add items to cart');
                return;
            }
            const cartData = {
                userId: parseInt(userId),
                restaurantId: parseInt(id),  // The restaurant ID from the route params
                foodItemId: foodItemId,
                quantity: 1  // You can adjust this or add logic to change the quantity
            };

            const response = await axios.post('http://localhost:8083/api/cart/add', cartData);
            fetchCartData()
            alert('Item added to cart!');
        } catch (error) {
            console.error('Error adding item to cart', error);
            alert('Error adding item to cart');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="restaurant-page">
            {/* Restaurant Banner */}
            {restaurant && (
                <div className="restaurant-banner">
                    <img 
                        src={`data:image/jpeg;base64,${restaurant.imageUrl}`} 
                        alt={restaurant.restaurantName} 
                        className="restaurant-banner-image" 
                    />
                    <div className="restaurant-banner-content">
                        <h1 className="restaurant-name">{restaurant.restaurantName}</h1>
                        <p className='restaurant-description'>{restaurant.description}</p>
                        <p className="restaurant-hours">Opening Hours: {restaurant.openingHours}</p>
                        <p className='restaurant-address'>{restaurant.address}</p>
                        <p className='restaurant-contact'>{restaurant.contactNo}</p>
                        
                        {/* <p className={`restaurant-status ${restaurant.open ? 'open' : 'closed'}`}>
                            {restaurant.open ? 'Open' : 'Closed'}
                        </p> */}
                    </div>
                </div>
            )}

            {/* Menu Items Section */}
            <header className="restaurant-header">
                <h2>Menu Items</h2>
            </header>
            <div className="menu-items-container">
                {menuItems?.map(item => (
                   <MenuItemCard key={item.id} menuItem={item} cartItems={cart?.cartItems} onAddToCart={handleAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantPage;
