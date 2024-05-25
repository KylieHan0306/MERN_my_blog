import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Error() {
    const location = useLocation();
    const { errorMessage } = location.state;
    
    return (
        <div>{errorMessage}</div>
    )
}
