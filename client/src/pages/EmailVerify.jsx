import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmailVerified () {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const errorHandle = (e) => {
        const errorMessage = e.response.data.errMsg;
        setLoading(false);
        if (errorMessage === "Your verification session has expired.") {
            setError(errorMessage); 
            return;
        }
        navigate('/error', { state: { errorMessage } });
    }

    const verify = async () => {
        try {
            const res = await axios.post('/api/auth/verify', { token });
            if(res.status < 300 && res.status >= 200) {
                navigate('/email-verify-success');
            }
        } catch (e) {
            errorHandle(e);
        }            
    }

    const requestVerifyEmail = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/resend', { token });
            if(res.status < 300 && res.status >= 200) {
                setMessage(res.data.message);
            }
        } catch (e) {
            errorHandle(e);
        }            
    }

    useEffect(() => {
        verify();
    }, [])
    
    return (
        <>
        { !loading && error.length !== 0 && 
            <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
                <h1 className="text-xl text-gray-600 mb-6">{error}</h1>
                <h2 className="text-l text-gray-600 mb-6">Click <button onClick={requestVerifyEmail}>here</button> to request a verification email again.</h2>
                {message.length !== 0 && <h3 className="text-green-500">{message}</h3>}
            </div>
        }
        </>
    );

};