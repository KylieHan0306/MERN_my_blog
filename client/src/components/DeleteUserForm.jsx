import React from 'react';
import { Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteStart, deleteSuccess, deleteFail } from '../store/userStore'
import { useSelector } from 'react-redux';
import errorGenerator from '../utils/errorGenerator';

export default function DeleteUserForm({ setOpenModal }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currUser, loading } = useSelector((state) => state.user);
    
    const handleDeleteUser = async (e) => {
        e.preventDefault();
        //setOpenModal(false);
        try {
            dispatch(deleteStart());
            const res = await axios.delete(`/api/user/${currUser._id}`);
            if (res.status >= 200 && res.status < 300) {
                dispatch(deleteSuccess());
                navigate('/');
            } else {
                dispatch(deleteFail());
                const error = errorGenerator();
                navigate('/error', {state: { error }});
            }
        } catch (e) {
            dispatch(deleteFail());
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }
    }

    return (
        <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
                <Button 
                    color='failure'  
                    type='button' 
                    onClick={handleDeleteUser}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Yes, I\'m sure'}
                </Button>
                <Button color='gray' type='button' onClick={() => setOpenModal(false)}>
                    No, cancel
                </Button>
            </div>
        </div>
    )
}
