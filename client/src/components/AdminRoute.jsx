import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function AdminRoute() {
  const { currUser } = useSelector((state) => state.user);
  return currUser && currUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/error' state={ { errorMessage: ' Only admin can access this page ' } } />
  );
}