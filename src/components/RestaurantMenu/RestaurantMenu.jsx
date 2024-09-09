import React, { useState, useEffect } from 'react';
import './RestaurantMenu.css';
import axios from 'axios';
import MenuItemModal from './MenuItemModal';
import { useParams } from 'react-router-dom';

const RestaurantMenu = ({ restaurant }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({
        restaurantName: '',
        categoryName: '',
        foodName: '',
        description: '',
        price: '',
        isAvailable: false,
        imageUrl: null,
    });
    const userId = localStorage.getItem('userId');
    const [editingMenuItem, setEditingMenuItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {

        if (restaurant !== null && restaurant?.id) {
            fetchMenuItems();
        }
    }, [restaurant]);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/menuItems/menuItemsByRestaurant/${restaurant.id}`);
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const handleFileChange = (e) => {
        setNewMenuItem({ ...newMenuItem, imageUrl: e.target.files[0] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem({ ...newMenuItem, [name]: value });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMenuItem(null);
        setNewMenuItem({
            restaurantName: '',
            categoryName: '',
            foodName: '',
            description: '',
            price: '',
            isAvailable: false,
            imageUrl: null,
        });
    };

    const addOrUpdateMenuItem = async () => {
        const formData = new FormData();
        
        try {
            let response;
            if (editingMenuItem) {
                formData.append('menuItemupdateInDTO', new Blob([JSON.stringify({
                    restaurantId:  restaurant.id,
                    categoryId:  newMenuItem.categoryId,
                    name:  newMenuItem.foodName,
                    description:  newMenuItem.description,
                    price:  newMenuItem.price,
                })], { type: 'application/json' }));
            
                if (newMenuItem.imageUrl) {
                    formData.append('multipartFile', newMenuItem.imageUrl);
                }
        
                response = await axios.put(`http://localhost:8081/api/menuItems/update/${editingMenuItem.id}/menuItem`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                formData.append('menuItemInDTO', new Blob([JSON.stringify({
                    restaurantId:  restaurant.id,
                    categoryId:  newMenuItem.categoryId,
                    foodName:  newMenuItem.foodName,
                    description:  newMenuItem.description,
                    price:  newMenuItem.price,
                })], { type: 'application/json' }));
            
                if (newMenuItem.imageUrl) {
                    formData.append('multipartFile', newMenuItem.imageUrl);
                }
        
                response = await axios.post('http://localhost:8081/api/menuItems/add/menuItem', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            if (response.status === 201 || response.status === 200) {
                const updatedMenuItem = response.data;
                fetchMenuItems();
                closeModal();
            } else {
                console.error('Failed to save menu item');
            }
        } catch (error) {
            console.error('Error saving menu item:', error);
        }
    };

    const startEditing = (menuItem) => {
        setEditingMenuItem(menuItem);
        setNewMenuItem({
            id: menuItem.id,
            categoryName: menuItem.categoryName,
            foodName: menuItem.foodName,
            description: menuItem.description,
            price: menuItem.price,
            isAvailable: menuItem.isAvailable,
            imageUrl: null,
        });
        openModal();
    };

    const deleteMenuItem = async (menuItemId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/menuItems/deleteMenuItem/${menuItemId}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                fetchMenuItems();
            } else {
                console.error('Failed to delete menu item');
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    const toggleAvailability = async (menuItem) => {
        try {
            const response = await fetch(`http://localhost:8081/api/menuItems/menuItem/${menuItem.id}/status`, {
                method: 'PUT',
            });

            if (response.status === 200) {
                fetchMenuItems();
            } else {
                console.error('Failed to toggle availability');
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    return (
        <div className="menu-manager">
            <div className="header">
                <h2>Menu Items</h2>
                <button className="add-button" onClick={openModal}>Add Item</button>
            </div>

            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li key={item.id} className="menu-item">
                        <div className="menu-info-container">
                        <div className='menu-info-image'>
                            <img src={`data:image/jpeg;base64,${item.imageUrl}`} alt={item.foodName} />
                        </div>
                        <div className="menu-info">
                            <span>{index + 1}. {item.foodName} ({item.categoryName}) - ${item?.price?.toFixed(2)}</span>
                            <span>{item.isAvailable ? 'Available' : 'Not Available'}</span>
                        </div>
                            </div>
                        <div className="menu-actions">
                            <button onClick={() => startEditing(item)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m13.26 3.6-8.21 8.69c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.77l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.34-5.29.16Z" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.89 5.05a6.126 6.126 0 0 0 5.45 5.15M3 22h18" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                            <button onClick={() => toggleAvailability(item)}>
                                {item.isAvailable ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 4h4c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4c-4.42 0-8-3.58-8-8s3.58-8 8-8Z" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 4h4c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4c-4.42 0-8-3.58-8-8s3.58-8 8-8Z" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>}
                            </button>
                            <button onClick={() => deleteMenuItem(item.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                        </div>
                    </li>
                ))}
            </ul>

            <MenuItemModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={addOrUpdateMenuItem}
                menuItem={newMenuItem}
                setMenuItem={setNewMenuItem}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                restaurantId={restaurant?.id}
            />
        </div>
    );
};

export default RestaurantMenu;
