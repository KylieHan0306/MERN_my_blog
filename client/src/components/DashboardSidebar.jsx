import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutStart, logoutSuccess, logoutFail } from '../store/userStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import errorGenerator from '../utils/errorGenerator';

export default function DashboardSidebar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { currUser } = useSelector((state) => state.user);
    const [tab, setTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) {
            const error = errorGenerator('login_required');
            navigate('/error', {state: {error}});
        }
    }, [currUser])

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            dispatch(logoutStart());
            const res = await axios.get('/api/auth/logout');
            if (res.status >= 200 && res.status < 300) {
                navigate('/');
                dispatch(logoutSuccess());
            }
        } catch (e) {
            dispatch(logoutFail());
            const error = errorGenerator();
            navigate('/error', {state: {error}});
        }
    }
    return (
        <Sidebar className='w-full'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
            {currUser && currUser.isAdmin && (
                <Link to='/dashboard?tab=overall'>
                    <Sidebar.Item
                        active={tab === 'overall' || !tab}
                        icon={HiChartPie}
                        as='div'
                    >
                        Overall
                    </Sidebar.Item>
                </Link>
            )}
            <Link to='/dashboard?tab=profile'>
                <Sidebar.Item
                    active={tab === 'profile'}
                    icon={HiUser}
                    label={currUser?.isAdmin ? 'Admin' : 'User'}
                    labelColor='dark'
                    as='div'
                >
                    Profile
                </Sidebar.Item>
            </Link>
            <Link to='/dashboard?tab=my-posts'>
              <Sidebar.Item
                active={tab === 'my-posts'}
                icon={HiDocumentText}
                as='div'
              >
                My Posts
              </Sidebar.Item>
            </Link>
            {currUser?.isAdmin && 
                <>
                <Link to='/dashboard?tab=all-posts'>
                    <Sidebar.Item
                        active={tab === 'all-posts'}
                        icon={HiDocumentText}
                        as='div'
                    >
                        All Posts
                    </Sidebar.Item>
                </Link>
                <Link to='/dashboard?tab=users'>
                    <Sidebar.Item
                        active={tab === 'users'}
                        icon={HiOutlineUserGroup}
                        as='div'
                    >
                        Users
                    </Sidebar.Item>
                </Link>
                <Link to='/dashboard?tab=comments'>
                    <Sidebar.Item
                        active={tab === 'comments'}
                        icon={HiAnnotation}
                        as='div'
                    >
                        Comments
                    </Sidebar.Item>
                </Link>
                </>
            }
            <Sidebar.Item
                icon={HiArrowSmRight}
                className='cursor-pointer'
                onClick={handleLogout}
            >
                Logout
            </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
        </Sidebar>
    );
}