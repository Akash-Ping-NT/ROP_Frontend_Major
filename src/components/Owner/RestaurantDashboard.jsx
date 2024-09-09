import React, { useEffect, useState } from 'react';
import './RestaurantDashboard.css';
import RestaurantEditPopup from './RestaurantEditPopup';
import { getRestaurantByUserId, updateRestaurantStatus, updateRestaurantDetails } from '../../utils/api'; 
import axios from 'axios';
import EditIcon from '../../assets/Edit-Linear-32px.svg';

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
        formData.append('restaurantUpdateInDTO', new Blob([JSON.stringify(updatedRestaurant)], { type: 'application/json' }));
    
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
                            <button className="edit-button" onClick={handleEditClick}><img className='restaurant-dashboard-edit' src={EditIcon} alt="Edit"  /></button>
                            </h1>                        
                        <p className='restaurant-dashboard-address'>{restaurant.description}</p>
                    </div>
                    <div className='restaurant-dashboard-status-container'>
                        <div onClick={updateStatus} className={`restaurant-dashboard-status ${restaurantOpen ? 'open' : 'closed'}`}>
                            {restaurantOpen ? 'Open' : 'Closed'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="restaurant-dashboard-details">
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
