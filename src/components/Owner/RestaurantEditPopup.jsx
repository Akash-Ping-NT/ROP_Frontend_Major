import React, { useEffect, useState } from 'react';
import './RestaurantEditPopup.css';

const RestaurantEditPopup = ({ restaurant, isOpen, onClose, onSave }) => {
    const [restaurantName, setRestaurantName] = useState(restaurant.restaurantName || '');
    const [address, setAddress] = useState(restaurant.address || '');
    const [contactInformation, setContactInformation] = useState(restaurant.contactNo || '');
    const [description, setDescription] = useState(restaurant.description || '');
    const [openingHours, setOpeningHours] = useState(restaurant.openingHours || '');
    const [image, setImage] = useState(null);
    const handleSave = () => {
        const updatedRestaurant = {
            ...restaurant,
            restaurantName,
            address,
            description,
            contactInformation,
            openingHours,
        };
        onSave(updatedRestaurant,image);
    };

    useEffect(() => {
        setRestaurantName(restaurant.restaurantName || '');
        setAddress(restaurant.address || '');
        setContactInformation(restaurant.contactNo || '');
        setDescription(restaurant.description || '');
        setOpeningHours(restaurant.openingHours || '');
    }, [restaurant]);

    if (!isOpen) return null;

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };


    return (
        <div className="restaurant-edit-popup">
            <div className="restaurant-edit-popup-content">
                <h2>Edit Restaurant</h2>
                <div>
                    <label>Restaurant Name:</label>
                    <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contact Number:</label>
                    <input
                        type="text"
                        value={contactInformation}
                        onChange={(e) => setContactInformation(e.target.value)}
                    />
                </div>
                <div>
                    <label>Opening Hours:</label>
                    <input
                        type="text"
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                    />
                </div>
                <div>
                    <label>
                        Upload Image:
                    </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                </div>
                <div className="restaurant-edit-popup-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantEditPopup;
