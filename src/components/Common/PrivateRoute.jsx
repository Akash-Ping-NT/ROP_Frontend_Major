import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, allowedRoles }) => {
  const userRole = useSelector((state) => state?.auth?.user?.role);
  
  


  return userRole && allowedRoles.includes(userRole) ? (
    <Component /> // Render the component properly
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default PrivateRoute;
