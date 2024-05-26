import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PrivateRoute() {
    const { currUser } = useSelector((state) => state.user)
    return currUser? <Outlet /> : <Navigate to='/error' state={ { errorMessage: ' Please login first ' } } />
}
