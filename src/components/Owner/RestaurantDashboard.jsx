import React, { useEffect, useState } from 'react';
import './RestaurantDashboard.css';
import RestaurantEditPopup from './RestaurantEditPopup';
import axios from 'axios';
import EditIcon from '../../assets/Edit-Linear-32px.svg';
import Toast from '../Toast.jsx/Toast';
import defaultImage from '../../assets/restaurant_default.jpg';


const RestaurantDashboard = ({ restaurant, setRestaurant, refreshData }) => {
    const [restaurantOpen, setRestaurantOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [message, setMessage] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        setRestaurantOpen(restaurant.open);
    }, [restaurant]);

    useEffect(() => {
        
    }, [showToast]);

    const convertTo12HourFormat = (time24) => {

        if (!time24) {
            return 'N/A'; 
        }
        const [hours, minutes] = time24.split(':');
        const hour12 = hours % 12 || 12; 
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
    };

    const updateStatus = async () => {
        try {
            await axios.put(`http://localhost:8081/api/restaurants/${restaurant.id}/status`);
            setRestaurantOpen(!restaurantOpen);
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
            const response = await axios.put(`http://localhost:8081/api/restaurants/${restaurant.id}/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if(response.status === 200) {
                setToastMessage(response.data.message);
                setToastType('success');
                setShowToast(true);
  
            }else{
                setToastMessage(response.data.message);
                setToastType('error');
                setShowToast(true);
            }
            // Call refreshData to fetch updated restaurant info
            refreshData();

            // Close the popup
            setIsEditPopupOpen(false);


        } catch (error) {
            console.error('Error updating restaurant:', error);
            setMessage(error.response.data);
        }
    };

    const handleEditClose = () => {
        setMessage({});
        setIsEditPopupOpen(false);
    };

    return (
        <div className="restaurant-dashboard">
            <div className="restaurant-dashboard-banner">
                    <img src={restaurant.imageUrl ? `data:image/jpeg;base64,${restaurant.imageUrl}`: defaultImage} alt={restaurant.restaurantName} className="restaurant-dashboard-image" />
                <div className="restaurant-dashboard-info">
                    <div>
                        <h1 className="restaurant-dashboard-name">
                            {restaurant.restaurantName}
                            <button className="edit-button" onClick={handleEditClick}>
                                <img className='restaurant-dashboard-edit' src={EditIcon} alt="Edit" />
                            </button>
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
                <span><strong>Opening Hours:</strong> {convertTo12HourFormat(restaurant.openingHours)}</span>
            </div>
            
            <RestaurantEditPopup
                message={message}
                restaurant={restaurant}
                isOpen={isEditPopupOpen}
                onClose={handleEditClose}
                onSave={handleEditSave}
            />
             {showToast && <Toast message={toastMessage} onClose={()=>{setShowToast(false)}} showToast={showToast} type={toastType}  /> }
        </div>
    );
};

export default RestaurantDashboard;
