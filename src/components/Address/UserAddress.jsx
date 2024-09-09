import React, { useEffect, useState } from 'react';
import './useraddress.css';
import { createAddress, deleteAddress, getAllAddress, updateAddress } from '../../utils/api';
import { states } from '../../constants/states';

const UserAddress = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, city: 'New York', country: 'USA', postalCode: '10001', state: 'NY', street: '123 5th Ave' },
    { id: 2, city: 'London', country: 'UK', postalCode: 'EC1A 1BB', state: 'London', street: '456 Oxford St' }
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

  useEffect(() => {
    getAllAddress(userId).then(addresses => setAddresses(addresses));
  }, []);


  const handleCreateAddress = () => {
    setAddressForm({ city: '', country: '', postalCode: '', state: '', streetAddress: '' });
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
    setCurrentAddressId(id);
    setIsEditing(true);
    setShowPopup(true);
  };


  useEffect(() => {
    console.log(addresses)
  },[addresses])
  const handleSaveAddress = () => {
    if (isEditing) {
      updateAddress(currentAddressId, addressForm).then(response => {
        getAllAddress(userId).then(addresses => setAddresses(addresses));
      })
      getAllAddress(userId).then(addresses => setAddresses(addresses));
    } else {
      const newAddress = { ...addressForm, userId };

      createAddress(newAddress).then(response => {
        getAllAddress(userId).then(addresses => setAddresses(addresses));      })
    }
    setShowPopup(false);
    setAddressForm({ city: '', country: '', postalCode: '', state: '', streetAddress: '' });
  };

  const handleCancel = () => {
    setShowPopup(false);
    setAddressForm({ city: '', country: '', postalCode: '', state: '', streetAddress: '' });
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id).then(() => {
      getAllAddress(userId).then(addresses => setAddresses(addresses));
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
            <input
              type="text"
              name="city"
              placeholder="City"
              value={addressForm.city}
              onChange={handleInputChange}
            />
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
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={addressForm.postalCode}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={addressForm.country}
              onChange={handleInputChange}
            />
            <div className="popup-actions">
              <button onClick={handleSaveAddress}>{isEditing ? 'Update' : 'Save'}</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddress;
