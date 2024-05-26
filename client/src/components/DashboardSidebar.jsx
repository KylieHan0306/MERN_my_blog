import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logoutSuccess } from '../store/userStore';
import { useDispatch, useSelector } from 'react-redux';

export default function DashboardSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currUser } = useSelector((state) => state.user);
    const [tab, setTab] = useState('profile');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

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
        <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
            <Link to='/dashboard?tab=profile'>
                <Sidebar.Item
                    active={tab === 'profile'}
                    icon={HiUser}
                    label={currUser.isAdmin ? 'Admin' : 'User'}
                    labelColor='dark'
                    as='div'
                >
                    Profile
                </Sidebar.Item>
            </Link>
            <Sidebar.Item
                icon={HiArrowSmRight}
                className='cursor-pointer'
                onClick={handleLogout}
            >
                Sign Out
            </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
        </Sidebar>
    );
}