import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateRestaurant.css';

const CreateRestaurantForm = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [address, setAddress] = useState('');
    const [contactInformation, setContactInformation] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [image, setImage] = useState(null); 
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const userId = localStorage.getItem('userId'); 

    if (!userId) {
        return <div>User ID not found in local storage</div>;
    }

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('createRestaurantRequestDTO', new Blob([JSON.stringify({
            userId, 
            restaurantName,
            address,
            contactInformation,
            openingHours
        })], { type: 'application/json' }));
    
        if (image) {
            formData.append('multipartFile', image);
        }
    
        try {
            await axios.post('http://localhost:8081/api/restaurants/addRestaurant', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/restaurant');
        } catch (error) {
            setError('An error occurred while creating the restaurant');
            console.error('Error creating restaurant:', error);
        }
    };
    
    return (
        <div className="create-restaurant-container">
            <h2>Create Restaurant</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Restaurant Name:
                    </label>
                        <input
                            type="text"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            required
                        />
                </div>
                <div>
                    <label>
                        Address:
                    </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                </div>
                <div>
                    <label>
                        Contact Information:
                    </label>
                        <input
                            type="text"
                            value={contactInformation}
                            onChange={(e) => setContactInformation(e.target.value)}
                            required
                        />
                </div>
                <div>
                    <label>
                        Opening Hours:
                    </label>
                        <input
                            type="text"
                            value={openingHours}
                            placeholder='09:00 AM - 11:00 PM'
                            onChange={(e) => setOpeningHours(e.target.value)}
                            required
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
                <button type="submit">Create Restaurant</button>
            </form>
        </div>
    );
};

export default CreateRestaurantForm;
