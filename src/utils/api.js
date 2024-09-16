import axios from 'axios';

const API_URL = 'http://localhost:8082/api'; // Adjust this to your Spring Boot backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  User
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const getUserProfile = (userId) => api.get(`/users/${userId}/fetchUser`);

export const updateUserProfile = (userId, userData) => {
  return api.put(`/users/${userId}/update`, userData);
}
export const updateWallet = (userId,wallet) =>{
  return api.put(`/users/${userId}/updateWallet`, wallet)
}
// Restaurant
export const createRestaurant = async (formData) => {
    const response = await fetch('http://localhost:8081/api/restaurants/addRestaurant', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const getRestaurantByUserId = async (userId) => {
  const response = await fetch(`http://localhost:8081/api/restaurants/user/?userId=${userId}`, {
      method: 'GET',
  });
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
}

export const getRestaurantsById = async (id) => {
  const response = await fetch(`http://localhost:8081/api/restaurants/getRestaurant/?id=${id}`, {
      method: 'GET',
  });
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}


export const deleteMenuItem = async (menuItemId) => {
  try {
      const response = await fetch(`http://localhost:8081/api/menuItems/deleteMenuItem/?id=${menuItemId}`, {
          method: 'DELETE',
      });

      if (response.status === 200) {
          const res = await response.json();
          return res;
      } else {
          throw new Error(response.message);
      }
  } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
  }
};


export const toggleMenuItemAvailability = async (menuItem) => {
  try {
      const response = await fetch(`http://localhost:8081/api/menuItems/menuItem/${menuItem.id}/status`, {
          method: 'PUT',
      });
      
      if (response.status === 200) {
          const res = await response.json();
          return res;
      } else {
          throw new Error(response.message);
      }
  } catch (error) {
      console.error('Error toggling menu item availability:', error);
      throw error;
  }
};
export const updateRestaurantStatus = async (restaurantId, status) => {
  try {
      const response = await axios.put(`http://localhost:8081/api/restaurants/${restaurantId}/status`, { status });
      if (response.status === 200) {
          return response.data;
      } else {
          throw new Error(response.message);
      }
  } catch (error) {
      console.error('Error updating restaurant status:', error);
      throw error;
  }
};

export const fetchMenuItemsByRestaurantId = async (restaurantId) => {
  try {
      const response = await fetch(`http://localhost:8081/api/menuItems/${restaurantId}/menuItemsByRestaurant`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
  }
};
export const getRestaurantByRestaurantId = async (restaurantId) => {
  const response = await fetch(`http://localhost:8081/api/restaurants/getRestaurant/?id=${restaurantId}`, {
      method: 'GET',
  });
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
}

// export const updateRestaurantStatus = async (restaurantId) => {
//   const response = await fetch(`http://localhost:8081/api/restaurants/${restaurantId}/status`, {
//       method: 'PUT',
//   })
//   if (!response.ok) {
//       throw new Error('Network response was not ok');
//   }
//   return response.json();
// }

export const fetchCategoriesByRestaurantId = async (restaurantId) => {
  try {
      const response = await fetch(`http://localhost:8081/api/categories/${restaurantId}/listAllCategory`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
  }
};

export const createCategory = async (newCategory, restaurantId) => {
  if (newCategory.trim() === '') return;

  try {
      const response = await fetch(`http://localhost:8081/api/categories/addCategory`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategory, restaurantId }),
      });

      if (response.status === 201) {
          const res= await response.json();
          return res;
      } else {
          const res = await response.json();
          throw new Error(res.message);
      }
  } catch (error) {
      console.error('Error adding category:', error);
      throw error;
  }
};


export const updateCategory = async (categoryId, categoryName) => {
  if (categoryName.trim() === '') return;

  try {
      const response = await fetch(`http://localhost:8081/api/categories/${categoryId}/update/category`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: categoryName }),
      });

      if (response.status === 200) {
          const res = await response.json();
          return res;
      } else {
          const res = await response.json();
          throw new Error(res.message);
      }
  } catch (error) {
      console.error('Error updating category:', error);
      throw error;
  }
};

export const deleteCategoryAPI = async (categoryId) => {
  try {
      const response = await fetch(`http://localhost:8081/api/categories/${categoryId}/deleteCategory`, {
          method: 'DELETE',
      });

      if (response.status === 200) {
          const res = await response.json();
          return res;
      } else {
          const res = await response.json();
          throw new Error(res.message);
      }
  } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
  }
};

export const updateRestaurantDetails = async (restaurantId, formData) => {
  const response = await fetch(`http://localhost:8081/api/restaurants/${restaurantId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Tell the server you're sending JSON
      },
      body: JSON.stringify(formData),
  })
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
}


// Address
export const createAddress = async (formData)=>{
      const response = await fetch('http://localhost:8082/api/address/addAddresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server you're sending JSON
        },
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}
export const deleteAddress = async (addressId)=>{
      const response = await fetch(`http://localhost:8082/api/address/${addressId}/delete`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}
export const getAllAddress = async (userId)=>{
      const response = await fetch(`http://localhost:8082/api/address/${userId}/addresses`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const updateAddress = async (addressId, formData)=>{
      const response = await fetch(`http://localhost:8082/api/address/${addressId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Tell the server you're sending JSON
        },
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const fetchOrdersForUser = async (userId) => {
  try {
      const response = await axios.get(`http://localhost:8083/api/orders/user/?userId=${userId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
  }
};

export const cancelOrder = async (orderId, userId) => {
  try {
      const response = await axios.put(`http://localhost:8083/api/orders/cancel/${orderId}?userId=${userId}`);
      if (response.status === 200) {
          return { success: true, data: response.data };
      } else {
          return { success: false, error: response.data.message };
      }
  } catch (error) {
      return { success: false, error: error.response.data.message };
  }
};


export const fetchAllRestaurants = async () => {
    try {
        const response = await axios.get('http://localhost:8081/api/restaurants/listAllRestaurant');
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        throw error;
    }
}


export const updateOrderStatus = async (orderId, newStatus, userId) => {
    try {
        await axios.put(`http://localhost:8083/api/orders/${orderId}/status`, { userId, newStatus });
        
    } catch (error) {
        console.error('Error updating order status', error);
        throw error;
    }
};

export const cancelOrderByOrderId = async (orderId, userId) => {
    try {
        const response = await axios.put(`http://localhost:8083/api/orders/cancel/${orderId}?userId=${userId}`);
        
        if (response.status === 200) {
            return { success: true, message: response.data.message };
        } else {
            return { success: false, error: response.data.message };
        }
    } catch (error) {
        
        return { success: false, error: error.response.data.message };
    }
};


export const fetchCartDataForUser = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8083/api/cart/${userId}/userCart`);
        return response.data.cartItems;
    } catch (error) {
        console.error("Error fetching cart data", error);
        throw error;
    }
};

export const updateQuantityInCartForUser = async (cartId, newQuantity, userId) => {
    try {
        await axios.put(`http://localhost:8083/api/cart/${cartId}/update`, {
            newQuantity: newQuantity,
            userId: userId
        });
    } catch (error) {
        console.error('Error updating quantity', error);
        throw error;
    }
};

export const deleteItemFromCartForUser = async (cartId, userId) => {
    try {
        const response = await axios.delete(`http://localhost:8083/api/cart/${userId}/delete/${cartId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item', error);
        throw error;
    }
};

export const clearCartForUser = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:8083/api/cart/clear/?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error clearing cart', error);
        throw error;
    }
};

export const validateCartAndCheckout = async (userId, totalPrice) => {
    try {
        const response = await axios.post(`http://localhost:8083/api/cart/validate`, {
            userId: userId,
            totalPrice: totalPrice
        });
        
        return response.data;
    } catch (error) {
        console.error('Error during checkout', error);
        throw error;
    }
};

export const sendContactMessage = async (data) => {
    try {
        const response = await axios.post('http://localhost:8082/api/mail/send', data);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (err) {
        throw err;
    }
};


export default api;