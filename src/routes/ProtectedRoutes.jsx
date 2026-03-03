import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const location = useLocation();

    // Check if user is logged in and has a valid session object
    if (!userInfo || !userInfo._id) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;


