import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateSuccess } from '../store/userStore';
import { useDispatch } from 'react-redux';
import errorGenerator from '../utils/errorGenerator';

export default function EmailVerified () {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const dispatch = useDispatch();
    
    //block if no token
    useEffect(() => {
        if (!queryParams.has('token')) {
            navigate('/error');
        }
    }, [location.search])

    const errorHandle = (e) => {
        const errorMessage = e.response.data.errMsg;
        setLoading(false);
        if (errorMessage === "Your verification session has expired.") {
            if (location.pathname==='email-verify') {
                setError(errorMessage); 
                return;
            } else {
                const error = errorGenerator();
                navigate('/error', {state: { error }});
            }
        }
    }

    const verify = async () => {
        try {
            const res = await axios.post(location.pathname==='/email-verify'? '/api/auth/verify': '/api/user/email-update', { token });
            if(res.status < 300 && res.status >= 200) {
                if (res.data.user) {
                    dispatch(updateSuccess(res.data.user));
                    navigate('/email-verify-success', {state: {message: 'Your new email was verified.'}});
                } else {
                    navigate('/email-verify-success', {state: {message: 'Your email was verified, you can now login to your account.'}});
                }
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