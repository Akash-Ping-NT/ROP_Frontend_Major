import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import './NavBar.css';
import AuthModal from '../AuthModal/AuthModal'; // Ensure this path is correct
import userEvent from '@testing-library/user-event';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const [loggedIn,setLoggedIn] = useState(false)

    const state = JSON.parse(localStorage.getItem('state'))
    const role = state?.auth?.user?.role
    useEffect(() => {
        if (state?.auth?.isAuthenticated) {
            setLoggedIn(true)
        }
    })
    
    const handleSignOut = () => {
        localStorage.clear();
        setLoggedIn(false)
        navigate('/')
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to={role=='RESTAURANT_OWNER' ? '/restaurant' : '/'} className="navbar-logo">
                    TastyBites
                </Link>
                <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
                    { role !== 'RESTAURANT_OWNER' &&
                        <Link to="/" className="navbar-link">
                        <FaHome className="navbar-icon" />
                        <span>Home</span>
                    </Link>
                    }
                    {loggedIn && role !== 'RESTAURANT_OWNER' &&
                    
                     <Link to="/dashboard" className="navbar-link">
                        <FaHome className="navbar-icon" />
                        <span>Dashboard</span>
                    </Link>
                    }
                    <Link to="/contact" className="navbar-link">
                        <AiOutlineMail className="navbar-icon" />
                        <span>Contact</span>
                    </Link>
                    {
                    role !== 'RESTAURANT_OWNER' &&
                    <Link to="/cart" className="navbar-link">
                        <FaShoppingCart className="navbar-icon" />
                        <span>Cart</span>
                    </Link>
                    }
                    <button className="navbar-link" onClick={()=>{
                        loggedIn ? handleSignOut() : openModal()}}>
                        <FaUser className="navbar-icon" />
                        <span>{loggedIn ? 'Sign Out' : 'Sign In'}</span>
                    </button>
                </div>
                <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <AuthModal isOpen={isOpen} onClose={closeModal} />
            </div>
        </nav>
    );
};

export default NavBar;
