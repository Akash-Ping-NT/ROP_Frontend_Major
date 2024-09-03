import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../../components/CardComponent/RestaurantCard';
import './HomePage.css';
import banner from '../../assets/banner.jpg'

const HomePage = () => {
    const [restaurants, setRestaurants] = useState([]);

    const role = localStorage.getItem('role');
    useEffect(() => {
        console.log('Fetching restaurant data');
        axios.get('http://localhost:8081/api/restaurants/getAllRestaurant')
            .then(response => {
                setRestaurants(response.data);
            })
            .catch(error => {
                console.error('Error fetching restaurant data:', error);
            });
    }, []);
    useEffect(() => {
        if(role==='RESTAURANT_OWNER') {
            window.location.href = "/dashboard";
        }
    }, []);

    return (
        <div className="home-container">
        
            <section className="home-hero">
                <img 
                    src={banner} 
                    alt="Delicious food" 
                    className="hero-image"
                />
                <div className="hero-content">
                    <h2 className='hero-title'>Find the best restaurants near you</h2>
                    <a href ="#restaurants" className="hero-button">Explore Restaurants</a>
                </div>
            </section>

            <section className="home-restaurants" id='restaurants'>
                <h2 className='home-restaurants-title'>Featured Restaurants</h2>
                <div className="restaurant-cards">
                    {restaurants.map(restaurant => (
                        <RestaurantCard 
                            key={restaurant.id} 
                            id={restaurant.id} 
                            name={restaurant.restaurantName} 
                            status={restaurant.open ? 'Open' : 'Closed'} 
                            imageUrl={restaurant.imageUrl}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
