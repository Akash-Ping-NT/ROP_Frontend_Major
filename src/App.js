import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ContactPage from './pages/ContactPage/ContactPage';
import CartPage from './pages/CartPage/CartPage';
import RestaurantPage from './pages/RestaurantPage/RestaurantPage';
// import SignIn from './pages/Common/SignIn';
import CustomerDashboard from './pages/Customer/CustomerDasboard';
import RestaurantOwnerDashboard from './pages/Owner/RestaurantOwnerDashboard';
import RestaurantOwnerMenu from './pages/Owner/RestaurantOwnerMenu';
import CreateRestaurant from './pages/Creation/CreateRestaurant';
import CustomerAddressDashboard from './pages/Customer/CustomerAddressDashboard';
import RestaurantOwnerCategories from './pages/Owner/RestaurantOwnerCategories';
import RestaurantOwnerProfile from './pages/RestaurantProfile/RestaurantOwnerProfile';
// import SignInPage from './pages/SignInPage';

function App() {
  return (
    <Router>
      <NavBar/>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/create-restaurant" element={<CreateRestaurant />} />
                {/* <Route path="/signin" element={<SignInPage />} /> */}
                {/* <Route path="/signin" element={<SignIn />} /> */}
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/dashboard/:slug" element={<CustomerAddressDashboard />} />
                <Route path="/restaurant/:id/menu" element={<RestaurantOwnerMenu />} />
                <Route path="/restaurant/restaurantOwnerProfile" element={<RestaurantOwnerProfile />} />
                <Route path="/restaurant/:id/categories" element={<RestaurantOwnerCategories />} />
                <Route path="/restaurant" element={<RestaurantOwnerDashboard />} />
                <Route path="/restaurant/:id" element={<RestaurantPage />} />
                {/* Add other routes here */}
            </Routes>
        </Router>
  );
}

export default App;
