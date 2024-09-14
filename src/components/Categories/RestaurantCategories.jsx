import React, { useState, useEffect } from 'react';
import './RestaurantCategories.css'; // Import CSS for styling
import Toast from '../Toast.jsx/Toast';

const RestaurantCategories = ({ restaurant }) => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null); // Track the category being edited
    const [editingName, setEditingName] = useState(''); // Track the new name during editing
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        // Fetch existing categories from the backend for the specific restaurantId
        

        if (restaurant && restaurant?.id) {
            console.log(restaurant)
            fetchCategories();
        }
    }, [restaurant]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/categories/getAllCategory/${restaurant.id}`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const addCategory = async () => {
        if (newCategory.trim() === '') return;

        try {
            const response = await fetch(`http://localhost:8081/api/categories/addCategory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategory, restaurantId: restaurant.id }),
            });

            if (response.status === 201) {
                const res= await response.json();
                setToastMessage(res.message);
                setToastType('success');
                setShowToast(true);

                fetchCategories();
                setNewCategory(''); // Clear the input field after adding
            } else {
                console.error('Failed to add category');
                alert('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            // alert(error.response.data.message);
            alert('Failed to add category');
            
        }
    };

    const startEditing = (category) => {
        setEditingCategory(category);
        setEditingName(category.name);
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditingName('');
    };

    const saveEditing = async (category) => {
        if (editingName.trim() === '') return;

        try {
            const response = await fetch(`http://localhost:8081/api/categories/${category.id}/update/category`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editingName }),
            });

            if (response.status === 200) {
                const res = await response.json();
                setToastMessage(res.message);
                setToastType('success');
                setShowToast(true);
                
                fetchCategories();
                cancelEditing();
            } else {
                console.error('Failed to update category');
                const res = await response.json();
                setToastMessage(res.message);
                setToastType('error');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert(error.response.data.message);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/categories/${categoryId}/deleteCategory`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                const res = await response.json();
                setToastMessage(res.message);
                setToastType('success');
                setShowToast(true);
                fetchCategories();

            } else {
                console.error('Failed to delete category');
                const res = await response.json();
                setToastMessage(res.message);
                setToastType('error');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="category-manager">
            <h2>Manage Categories</h2>
            <div className="add-category">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                />
                <button onClick={addCategory}>Add Category</button>
            </div>
            <ul className="category-list">
                {categories?.map((category, index) => (
                    <li key={category.id} className="category-item">
                        {editingCategory?.id === category.id ? (
                            <div className="edit-category">
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    placeholder="Edit category name"
                                />
                                <div className="category-actions">
                                    <button onClick={() => saveEditing(category)}>Save</button>
                                    <button onClick={cancelEditing}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="category-info">
                                <span>{index + 1}. {category.name}</span>
                                <div className="category-actions">
                                    <button onClick={() => startEditing(category)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m13.26 3.6-8.21 8.69c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.77l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.34-5.29.16Z" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.89 5.05a6.126 6.126 0 0 0 5.45 5.15M3 22h18" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                                    <button onClick={() => deleteCategory(category.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {
                showToast && <Toast message={toastMessage} type={toastType} showToast={showToast} onClose={() => setShowToast(false)} />
            }
        </div>
    );
};

export default RestaurantCategories;
