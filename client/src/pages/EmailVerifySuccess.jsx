import React from 'react'
import emailVerifiedImage from '../assets/email_verified.png';
import { useLocation } from 'react-router-dom';

export default function EmailVerifySuccess() {
    const location = useLocation();
    const { message } = location.state || {};
    return (
        <>
            <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 min-h-screen">
                <img src={emailVerifiedImage} alt="Email Verified" className="mt-4 mb-4"/>
                <h1 className="text-xl text-gray-600 dark:text-gray-400 mb-6">{message}</h1>
            </div>
        </>
    );
}
