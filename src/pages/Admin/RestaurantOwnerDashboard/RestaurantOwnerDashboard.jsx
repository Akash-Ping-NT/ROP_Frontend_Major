import React, { useEffect, useState } from 'react';
import './RestaurantOwnerDashboard.css'; // Import your custom CSS styles
import { useNavigate } from 'react-router-dom';
import { getRestaurantByUserId } from '../../../utils/api';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RestaurantAdmin = () => {

    const [restaurants, setRestaurants] = useState([]);
    const userId = useSelector((state) => state.auth.user.userId);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [image,setImage] = useState(null);
    const [restaurantName, setRestaurantName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [contactInformation, setContactInformation] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const fetchRestaurantData = async () => {
    try {
        getRestaurantByUserId(userId).then((data) => {
            console.log("Heree")
            setRestaurants(data);
        }).catch((error) => {
            console.error('Error fetching restaurant data:', error);
            navigate('/create-restaurant')
        })
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        navigate('/create-restaurant')

    }
};

  useEffect(() => {
    fetchRestaurantData();
}, [userId]);

  const handleAddRestaurant = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };


  
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
};

const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('submitting form')
    
    const formData = new FormData();
    formData.append('restaurantInDTO', new Blob([JSON.stringify({
        userId, 
        restaurantName,
        description,
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

        setAddress('');
        setContactInformation('');
        setOpeningHours('');
        setRestaurantName('');
        setDescription('');
        setImage(null);
        closePopup(true);
        fetchRestaurantData(); 
        navigate('/admin/restaurants');
        
    } catch (error) {
        console.error('Error creating restaurant:', error);
    }

    
};

  return (
    <div className="restaurant-admin-container">
      <div className="restaurant-header">
        <h2>Welcome, {user?.firstName}</h2>
        <button className="add-restaurant-btn" onClick={handleAddRestaurant}>
          Add Restaurant
        </button>
      </div>

      <div className="restaurant-cards">
        {restaurants?.map((restaurant) => (
          <div onClick={() => navigate(`/admin/restaurants/${restaurant.id}/dashboard`)} key={restaurant.id} className="restaurant-card">
            <img src={`data:image/jpeg;base64,${restaurant.imageUrl}`} alt={restaurant.name} />
            <h3 className="restaurant-name">{restaurant.restaurantName}</h3>
            <p className="restaurant-description">{restaurant.description}</p>
            <p  className="restaurant-address">{restaurant.address}</p>
            <p className="restaurant-contact">{restaurant.contactNo}</p>
            <p>Status: { restaurant.open ? 'Open' : 'Closed'}</p>
            {/* restaurant.open ? 'Open' : 'Closed' */}
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Add New Restaurant</h2>
            <form>
              {/* Add form fields for adding a new restaurant here */}
              <input type="text" value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)} placeholder="Restaurant Name" required />
              <input type="text" value={description}
                            onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
              <input type="text" value={address}
                            onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
              <input type="text" value={contactInformation} onChange={(e) => setContactInformation(e.target.value)} placeholder="Contact Information" required />
              <input type="text" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} placeholder="Opening Hours" required />
              <input type="file" onChange={handleImageChange} placeholder="Upload Restaurant Image" required />

              <button className='submit' onClick={handleSubmit}>Submit</button>
              <button type="button" onClick={closePopup}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantAdmin;
