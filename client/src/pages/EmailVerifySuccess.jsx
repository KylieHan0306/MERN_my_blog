import React from 'react'
import emailVerifiedImage from '../assets/email_verified.png';

export default function EmailVerifySuccess() {
    return (
        <>
            <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
                <img src={emailVerifiedImage} alt="Email Verified" className="mt-4 mb-4"/>
                <h1 className="text-xl text-gray-600 mb-6">Your email was verified, you can now login to your account.</h1>
            </div>
        </>
    );
}
