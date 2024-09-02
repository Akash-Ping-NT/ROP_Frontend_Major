import React, { useEffect, useState } from 'react';
import './RestaurantDashboard.css';
import RestaurantEditPopup from './RestaurantEditPopup'; // Import the new EditPopup component
import { getRestaurantByUserId, updateRestaurantStatus, updateRestaurantDetails } from '../../utils/api'; // Assuming this API exists
import axios from 'axios';

const RestaurantDashboard = ({restaurant, setRestaurant}) => {
    const [restaurantOpen, setRestaurantOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); 

    
    useEffect(() => {
        setRestaurantOpen(restaurant.open);
    },[restaurant]);
    const updateStatus = async () => {
        try {
            updateRestaurantStatus(restaurant?.id).then(() => {
                setRestaurantOpen(!restaurantOpen);
            })
        } catch (error) {
            console.error('Error updating restaurant status:', error);
        }
    };

    const handleEditClick = () => {
        setIsEditPopupOpen(true);
    };

    const handleEditSave = async (updatedRestaurant, image) => {
        const formData = new FormData();
        formData.append('restaurantUpdateRequestDTO', new Blob([JSON.stringify(updatedRestaurant)], { type: 'application/json' }));
    
        if (image) {
            formData.append('multipartFile', image);
        }
        try {
            await axios.put(`http://localhost:8081/api/restaurants/${restaurant.id}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                setRestaurant(updatedRestaurant);
                setIsEditPopupOpen(false);
            })
        } catch (error) {
            console.error('Error creating restaurant:', error);
        }
    };

    const handleEditClose = () => {
        setIsEditPopupOpen(false);
    };

    return (
        <div className="restaurant-dashboard">
            <div className="restaurant-dashboard-banner">
                {restaurant.imageUrl ? (
                    <img src={`data:image/jpeg;base64,${restaurant.imageUrl}`}
                    alt={restaurant.restaurantName} className="restaurant-dashboard-image" />
                ) : (
                    <div className="restaurant-dashboard-placeholder">Image Not Available</div>
                )}
                <div className="restaurant-dashboard-info">
                    <div>
                        <h1 className="restaurant-dashboard-name">{restaurant.restaurantName}
                            <button className="edit-button" onClick={handleEditClick}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg></button> {/* Add edit button */}
                            </h1>                        
                        <p className='restaurant-dashboard-address'>{restaurant.address}</p>
                    </div>
                    <div className='restaurant-dashboard-status-container'>
                        <div onClick={updateStatus} className={`restaurant-dashboard-status ${restaurantOpen ? 'open' : 'closed'}`}>
                            {restaurantOpen ? 'Open' : 'Closed'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="restaurant-dashboard-details">
                <span><strong>Email:</strong> {restaurant.email}</span>
                <span><strong>Address:</strong> {restaurant.address}</span>
                <span><strong>Contact Number:</strong> {restaurant.contactNo}</span>
                <span><strong>Opening Hours:</strong> {restaurant.openingHours}</span>
            </div>
            
            <RestaurantEditPopup
                restaurant={restaurant}
                isOpen={isEditPopupOpen}
                onClose={handleEditClose}
                onSave={handleEditSave}
            />
        </div>
    );
};

export default RestaurantDashboard;
