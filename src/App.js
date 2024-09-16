import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ContactPage from './pages/ContactPage/ContactPage';
import CartPage from './pages/CartPage/CartPage';
import RestaurantPage from './pages/RestaurantPage/RestaurantPage';
import CustomerDashboard from './pages/Customer/CustomerDasboard';
import RestaurantOwnerDashboard from './pages/Admin/RestaurantOwnerDashboard/RestaurantOwnerDashboard';
import CreateRestaurant from './pages/Creation/CreateRestaurant';
import CustomerAddressDashboard from './pages/Customer/CustomerAddressDashboard';
import RestaurantOwnerProfile from './pages/RestaurantProfile/RestaurantOwnerProfile';
import RestaurantOwnerRestaurants from './pages/Admin/RestaurantOwnerRestaurants/RestaurantOwnerRestaurants';
import RestaurantOwnerCategories from './pages/Admin/RestaurantCategories/RestaurantOwnerCategories';
import RestaurantOwnerMenu from './pages/Admin/RestaurantMenu/RestaurantOwnerMenu';
import RestaurantOwnerOrders from './pages/Admin/RestaurantOrders/RestaurantOwnerOrders';
import Checkout from './pages/Checkout/Checkout';
import RestaurantOrders from './pages/Orders/RestaurantOrders';
import Unauthorized from './components/Common/Unauthorized';
import PrivateRoute from './components/Common/PrivateRoute';
import { useState } from 'react';

function App() {

  // function isLoggedIn() {
  //   return sessionStorage.getItem('loggedIn') === 'true';
  // }
  
  // // Function to show the login first notification
  // function showLoginFirstNotification() {
  //   window.location.href = "/";  // Redirect to the login page
  // }
  
  // // Handle the popstate event (back navigation)
  // window.addEventListener('popstate', function(event) {
  //   if (!isLoggedIn()) {
  //       event.preventDefault();
  //       showLoginFirstNotification();
  //   }
  // });

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<PrivateRoute component={CartPage} allowedRoles={['CUSTOMER']} />} />
        <Route path="/create-restaurant" element={<PrivateRoute component={CreateRestaurant} allowedRoles={['RESTAURANT_OWNER']} />} />
        {/* <Route path="/dashboard" element={<CustomerDashboard />} /> */}
        <Route path="/dashboard" element={<PrivateRoute component={CustomerDashboard} allowedRoles={['CUSTOMER']} />} />
        <Route path="/dashboard/:slug" element={<PrivateRoute component={CustomerAddressDashboard} allowedRoles={['CUSTOMER']} />} />
        <Route path="/restaurant/:id/menu" element={<RestaurantOwnerMenu />} />
        <Route path="/restaurant/restaurantOwnerProfile" element={<PrivateRoute component={RestaurantOwnerProfile} allowedRoles={['RESTAURANT_OWNER']} />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/dashboard/orders" element={<PrivateRoute component={RestaurantOrders} allowedRoles={['CUSTOMER']} />} />
        <Route path="/admin/restaurants" element={<PrivateRoute component={RestaurantOwnerDashboard} allowedRoles={['RESTAURANT_OWNER']} />} />
        <Route path="/admin/restaurants/dashboard" element={<PrivateRoute component={RestaurantOwnerDashboard} allowedRoles={['RESTAURANT_OWNER']} />} />
        <Route path="/admin/restaurants/:id/dashboard" element={<PrivateRoute component={RestaurantOwnerRestaurants} allowedRoles={['RESTAURANT_OWNER']} />} />
        <Route path="/admin/restaurants/:id/categories" element={<PrivateRoute component={RestaurantOwnerCategories} allowedRoles={['RESTAURANT_OWNER']} />} />
        <Route path="/admin/restaurants/:id/menu" element={<PrivateRoute component={RestaurantOwnerMenu} allowedRoles={['RESTAURANT_OWNER']} />} />
        <Route path="/admin/restaurants/:id/orders" element={<PrivateRoute component={RestaurantOwnerOrders} allowedRoles={['RESTAURANT_OWNER']} />} />
        <Route path="/checkout" element={<PrivateRoute component={Checkout} allowedRoles={['CUSTOMER']} />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
