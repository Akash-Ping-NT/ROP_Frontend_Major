import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MenuItemModal.css';

const MenuItemModal = ({ isOpen, onClose, onSubmit, menuItem, setMenuItem, handleFileChange }) => {
    const { id: restaurantId } = useParams();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (restaurantId) {
            fetch(`http://localhost:8081/api/categories/getAllCategory/${restaurantId}`)
                .then(response => response.json())
                .then(data => {setCategories(data);
                    setMenuItem(prevState => ({
                        ...prevState,
                        categoryId: data.find(category => category.name == menuItem.categoryName)?.id
                    }))
                })
                .catch(error => console.error('Error fetching categories:', error));
        }
    }, [restaurantId,isOpen]);

    if (!isOpen) return null;

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setMenuItem(prevState => ({
            ...prevState,
            categoryId: selectedCategoryId
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{menuItem.id ? 'Edit Menu Item' : 'Add Menu Item'}</h2>

                <select
                    name="categoryId"
                    value={menuItem.categoryId || categories.find(category => category.name == menuItem.categoryName)?.id}
                    onChange={handleCategoryChange}
                    placeholder="Select category"
                >
                    <option value="">Select category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select> 

                <input
                    type="text"
                    name="foodName"
                    value={menuItem.foodName}
                    onChange={(e) => setMenuItem({ ...menuItem, foodName: e.target.value })}
                    placeholder="Enter food name"
                />
                <input
                    type="text"
                    name="description"
                    value={menuItem.description}
                    onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                    placeholder="Enter description"
                />
                <input
                    type="number"
                    name="price"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                    placeholder="Enter price"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <div className="modal-actions">
                    <button onClick={() => onSubmit(menuItem)}>
                        {menuItem.id ? 'Save Changes' : 'Add Menu Item'}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemModal;
