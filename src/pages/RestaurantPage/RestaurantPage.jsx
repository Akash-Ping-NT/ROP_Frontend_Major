import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';

const RestaurantPage = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                // Fetch restaurant details
                const restaurantResponse = await axios.get(`http://localhost:8081/api/restaurants/getRestaurant/${id}`);
                setRestaurant(restaurantResponse.data);

                // Fetch menu items
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
    }, [id]);

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
                        <p className="restaurant-hours">Opening Hours: {restaurant.openingHours}</p>
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
                {menuItems.map(item => (
                    <div key={item.id} className="menu-item-card">
                        <img src={`data:image/jpeg;base64,${item.imageUrl}`} alt={item.foodName} className="menu-item-image"/>
                        <div className="menu-item-details">
                            <h2 className="menu-item-name">{item.foodName}</h2>
                            <p className="menu-item-description">{item.description}</p>
                            <span className={`menu-item-status ${item.isAvailable ? 'available' : 'not-available'}`}>
                                {item.isAvailable ? 'Available' : 'Not Available'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantPage;
