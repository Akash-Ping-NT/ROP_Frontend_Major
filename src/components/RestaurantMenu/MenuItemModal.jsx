import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MenuItemModal.css';

const MenuItemModal = ({ isOpen, onClose, onSubmit, menuItem, setMenuItem, handleFileChange,error }) => {
    const { id: restaurantId } = useParams();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (restaurantId) {
            fetch(`http://localhost:8081/api/categories/${restaurantId}/listAllCategory`)
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
                {error.categoryId && <p className="error">{error.categoryId}</p>}

                <input
                    type="text"
                    name="foodName"
                    value={menuItem.foodName}
                    onChange={(e) => setMenuItem({ ...menuItem, foodName: e.target.value })}
                    placeholder="Enter food name"
                />
                {error.foodName && <p className="error">{error.foodName}</p>}
                {error.name && <p className="error">{error.name}</p>}
                <input
                    type="text"
                    name="description"
                    value={menuItem.description}
                    onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                    placeholder="Enter description"
                />
                {error.description && <p className="error">{error.description}</p>}
                <input
                    type="number"
                    name="price"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                    placeholder="Enter price"
                />
                {error.price && <p className="error">{error.price}</p>}
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                
                {error.message && <p className="error">{error.message}</p>}
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
