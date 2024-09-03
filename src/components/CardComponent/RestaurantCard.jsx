// src/components/RestaurantCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ id, name, status, imageUrl }) => {
    return (
        <Link to={`/restaurant/${id}`} className="restaurant-card-link">
            <div className="restaurant-card">
                <div className="restaurant-image-container">
                    <img
                        src={`data:image/jpeg;base64,${imageUrl}`}
                        alt={name}
                        className="restaurant-image"
                    />
                </div>
                <div className={`restaurant-status ${status === 'Open' ? 'open' : 'closed'}`}>
                    {status}
                </div>
                <div className="restaurant-details">
                    <h3 className="restaurant-name">{name}</h3>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
