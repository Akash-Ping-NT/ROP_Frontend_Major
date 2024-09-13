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
export const getUserProfile = (userId) => api.get(`/users/${userId}`);


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
  const response = await fetch(`http://localhost:8081/api/restaurants/user/${userId}`, {
      method: 'GET',
  });
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
}
export const getRestaurantByRestaurantId = async (restaurantId) => {
  const response = await fetch(`http://localhost:8081/api/restaurants/getRestaurant/${restaurantId}`, {
      method: 'GET',
  });
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
}

export const updateRestaurantStatus = async (restaurantId) => {
  const response = await fetch(`http://localhost:8081/api/restaurants/${restaurantId}/status`, {
      method: 'PUT',
  })
  if (!response.ok) {
      throw new Error('Network response was not ok');
  }
  return response.json();
}

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


export default api;