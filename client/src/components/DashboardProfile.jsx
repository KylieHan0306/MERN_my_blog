import { Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import MediumModal from './Modal';
import DeleteUserForm from './DeleteUserForm';

export default function DashboardProfile() {
    const { currUser, loading } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('form submit');
    };

    const handleLogout = async () => {
        try {
            dispatch(logoutStart());
            const res = await axios.get('/api/auth/logout');
            if (res.status >= 200 && res.status < 300) {
                dispatch(logoutSuccess());
                navigate('/');
            }
        } catch (e) {
            dispatch(loginFail());
            const errorMessage = e.response.data.errMsg;
            navigate('/error', { state: { errorMessage } });
        }
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
            type='file'
            accept='image/*'
            hidden
            />
            <div
            className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
            >
            <img
                src={currUser.photoUrl}
                alt='user'
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]`}
            />
            </div>
            <TextInput
                type='text'
                id='username'
                placeholder='username'
                defaultValue={currUser.username}
                onChange={handleChange}
            />
            <TextInput
                type='email'
                id='email'
                placeholder='email'
                defaultValue={currUser.email}
                onChange={handleChange}
            />
            <TextInput
            type='password'
            id='password'
            placeholder='password'
            onChange={handleChange}
            />
            <Button
                type='submit'
                outline
                disabled={loading}
                style={{
                    backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                }}
            >
            {loading ? 'Loading...' : 'Update'}
            </Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer' onClick={()=> {setOpenModal(true)}}>
                Delete Account
            </span>
            <span onClick={handleLogout} className='cursor-pointer'>
                Logout
            </span>
        </div>
        <MediumModal openModal={openModal} setOpenModal={setOpenModal}>
                <DeleteUserForm setOpenModal={setOpenModal}/>
        </MediumModal>
        </div>
    );
}