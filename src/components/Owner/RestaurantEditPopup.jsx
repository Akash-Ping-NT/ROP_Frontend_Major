import React, { useEffect, useState } from 'react';
import './RestaurantEditPopup.css';

const RestaurantEditPopup = ({message, restaurant, isOpen, onClose, onSave }) => {
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
    }, [restaurant,isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };


    return (
        <>
        <div className="modal-overlay"></div>
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
                    {message.restaurantName && <p className="error">{message.restaurantName}</p>}
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {message.address && <p className="error">{message.address}</p>}
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {message.description && <p className="error">{message.description}</p>}
                </div>
                <div>
                    <label>Contact Number:</label>
                    <input
                        type="text"
                        value={contactInformation}
                        onChange={(e) => setContactInformation(e.target.value)}
                    />
                    {message.contactInformation && <p className="error">{message.contactInformation}</p>}
                </div>
                <div>
                    <label>Opening Hours:</label>
                    <input className='opening-hours'
                        type="time"
                        value={openingHours}
                        onChange={(e) => setOpeningHours(e.target.value)}
                    />
                    {message.openingHours && <p className="error">{message.openingHours}</p>}
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
                    {message.image && <p className="error">{message.image}</p>}
                    {message.message && <p className="error">{message.message}</p>}
                </div>
                <div className="restaurant-edit-popup-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default RestaurantEditPopup;
