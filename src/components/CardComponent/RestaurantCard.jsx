// src/components/RestaurantCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';
import defaultImage from '../../assets/restaurant_default.jpg';


const RestaurantCard = ({ id, name, status, imageUrl, openingHours, description }) => {
    return (
        // <Link to={ status === 'Open' ? `/restaurant/${id}` : '#'} className={`restaurant-card-link homepage-card`}>
        <Link to={`/restaurant/${id}`} className="restaurant-card-link homepage-card">
            <div className={`restaurant-card ${status === 'Open' ? 'open-card' : 'closed-card'}`}>
                <div className="restaurant-image-container">
                    <img
                        src={imageUrl ? `data:image/jpeg;base64,${imageUrl}`: defaultImage}
                        alt={name}
                        className="restaurant-image"
                    />
                </div>
                <div className={`restaurant-status ${status === 'Open' ? 'open' : 'closed'}`}>
                    {status}
                </div>
                <div className="restaurant-details">
                    <h3 className="restaurant-name">{name}</h3>
                    <p className="restaurant-description-card">{description}</p>
                    {/* <p className='restaurant-opening-hours'>{openingHours}</p> */}
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
