import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryDropdown.css'; // CSS for dropdown styling

const CategoryDropdown = ({ restaurantId, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Default to 'all'
  const [isOpen, setIsOpen] = useState(false); // Toggle for dropdown visibility

  // Fetch categories when the component is mounted
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/categories/${restaurantId}/listAllCategory`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [restaurantId]);

  // Handle category selection
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);

    if (categoryId === 'all') {
      // Fetch all menu items if "All" is selected
      const menuResponse = await axios.get(`http://localhost:8081/api/menuItems/${restaurantId}/menuItemsByRestaurant`);
      onCategorySelect(menuResponse.data);
    } else {
      // Fetch menu items by selected category
      const menuResponse = await axios.get(`http://localhost:8081/api/menuItems/menuItemsByCategory/${categoryId}`);
      onCategorySelect(menuResponse.data);
    }
  };

  return (
    <div className="category-dropdown">
      <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {selectedCategory === 'all' ? 'ALL MENU ITEMS' : categories.find(c => c.id === selectedCategory)?.name}
      </button>
      
      {/* Dropdown menu */}
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <li>
          <label>
            <input
              type="checkbox"
              checked={selectedCategory === 'all'}
              onChange={() => handleCategoryChange('all')}
            />
            ALL MENU ITEMS
          </label>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedCategory === category.id}
                onChange={() => handleCategoryChange(category.id)}
              />
              {category.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDropdown;
