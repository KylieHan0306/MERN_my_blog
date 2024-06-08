import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Error() {
    const location = useLocation();
    const error = location.state?.error?? {
        message: 'Oops! The page you are looking for does not exist.',
        code: 404,
    };
    
    return (
        <div className='flex flex-col min-h-screen min-w-full justify-center items-center'>
            <h1 className='text-7xl font-bold justify-center items-center' id='errorCode'>
                {error.code}
            </h1>
            <h3 className='text-3xl'>
            {error.message}
            </h3>
        </div>
    )
}
