import React, { useEffect, useState } from 'react';
import './useraddress.css';
import { createAddress, deleteAddress, getAllAddress, updateAddress } from '../../utils/api';
import { states } from '../../constants/states';
import Toast from '../Toast.jsx/Toast';

const UserAddress = () => {
  const [addresses, setAddresses] = useState([
    
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('userId');
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    city: '',
    country: '',
    postalCode: '',
    state: '',
    streetAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    getAllAddress(userId).then(addresses => setAddresses(addresses)).catch(error =>{
      console.error('Error fetching addresses:', error);
      setToastMessage('Error fetching addresses');
      setToastType('error');
      setShowToast(true);
    });
  }, []);


  const handleCreateAddress = () => {
    setAddressForm({ city: '', country: '', postalCode: '', state: '', streetAddress: '' });
    setErrors({})
    setIsEditing(false);
    setShowPopup(true);
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find(address => address.addressId === id);
    setAddressForm({
      city: addressToEdit.city,
      country: addressToEdit.country,
      postalCode: addressToEdit.postalCode,
      state: addressToEdit.state,
      streetAddress: addressToEdit.street
    });
    setErrors({})
    setCurrentAddressId(id);
    setIsEditing(true);
    setShowPopup(true);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!addressForm.streetAddress || addressForm.streetAddress.length < 5) {
      newErrors.streetAddress = 'Street address is required and must be at least 5 characters';
    }

    if (!addressForm.city || addressForm.city.length < 3) {
      newErrors.city = 'City is required and must be at least 3 characters';
    }

    if (!addressForm.state) {
      newErrors.state = 'State is required';
    }

    if (!addressForm.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    } else if (addressForm.country === 'USA' && !/^\d{5}$/.test(addressForm.postalCode)) {
      newErrors.postalCode = 'Postal code for USA must be exactly 5 digits';
    } else if (addressForm.country !== 'USA' && !/^[A-Za-z0-9]{6,7}$/.test(addressForm.postalCode)) {
      newErrors.postalCode = 'Postal code must be 6-7 characters';
    }

    if (!addressForm.country || addressForm.country.length < 2) {
      newErrors.country = 'Country is required and must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  useEffect(() => {
    
  },[addresses])
  const handleSaveAddress = () => {
    if (!validateForm()) {
      return; // If validation fails, stop execution here
    }

    if (isEditing) {
      updateAddress(currentAddressId, addressForm).then(response => {
        setToastMessage(response.message);
          setToastType('success');
          setShowToast(true);
        getAllAddress(userId).then(addresses => setAddresses(addresses));
      })
      getAllAddress(userId).then(addresses => setAddresses(addresses));
    } else {
      const newAddress = { ...addressForm, userId };

      createAddress(newAddress).then(response => {
        setToastMessage(response.message);
        setToastType('success');
        setShowToast(true);
        getAllAddress(userId).then(addresses => setAddresses(addresses));      })
    }
    setShowPopup(false);
    setAddressForm({ city: '', country: '', postalCode: '', state: '', streetAddress: '' });
  };

  const handleCancel = () => {
    setShowPopup(false);
    setAddressForm({ city: '', country: '', postalCode: '', state: '', streetAddress: '' });
    setErrors({})
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id).then(() => {
      getAllAddress(userId).then(addresses => setAddresses(addresses));
      setToastMessage('Address deleted successfully');
        setToastType('success');
        setShowToast(true);
      }).catch(error => {
      console.error('Error deleting address:', error);
    })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm({ ...addressForm, [name]: value });
  };

  return (
    <div className="address-container">
      <div className="address-header">
        <h2>Address</h2>
        <button className="create-address-btn" onClick={handleCreateAddress}>Create Address</button>
      </div>
      <table className="address-table">
        <thead>
          <tr>
            <th>Street Address</th>
            <th>City</th>
            <th>State</th>
            <th>Postal Code</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address.addressId}>
              <td>{address?.street}</td>
              <td>{address.city}</td>
              <td>{address.state}</td>
              <td>{address.postalCode}</td>
              <td>{address.country}</td>
              <td className="address-actions">
                <button className="edit-address-btn" onClick={() => handleEditAddress(address.addressId)}>Edit</button>
                <button className='delete-address-btn' onClick={() => handleDeleteAddress(address.addressId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{isEditing ? 'Edit Address' : 'Create Address'}</h3>
            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              value={addressForm.streetAddress}
              onChange={handleInputChange}
            />
             {errors.streetAddress && <p className="error">{errors.streetAddress}</p>}
            <input
              type="text"
              name="city"
              placeholder="City"
              value={addressForm.city}
              onChange={handleInputChange}
            />
            {errors.city && <p className="error">{errors.city}</p>}

            <select
              name="state"
              value={addressForm.state}
              onChange={handleInputChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="error">{errors.state}</p>}

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={addressForm.postalCode}
              onChange={handleInputChange}
            />
             {errors.postalCode && <p className="error">{errors.postalCode}</p>}

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={addressForm.country}
              onChange={handleInputChange}
            />
             {errors.country && <p className="error">{errors.country}</p>}

            <div className="popup-actions">
              <button onClick={handleSaveAddress}>{isEditing ? 'Update' : 'Save'}</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

{showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default UserAddress;
