import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo || !userInfo._id) {
        return <Navigate to="/login" replace />;
    }

    return userInfo.isAdmin ? <Outlet /> : <Navigate to="/" replace />;

};


export default AdminRoute;
