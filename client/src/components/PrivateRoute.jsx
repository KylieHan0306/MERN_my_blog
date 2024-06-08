import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PrivateRoute() {
    const { currUser } = useSelector((state) => state.user);
    const error = {
        message: 'To access this feature, please log in to your account.',
        code: 401
    }
    return currUser? <Outlet /> : <Navigate to='/error' state={ { error } } />
}
