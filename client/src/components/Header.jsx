import { Button, Navbar, TextInput, Dropdown, Avatar  } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import Modal from './Modal';
import LoginRegisterForm from "./LoginRegisterForm";
import PasswordResetRequestForm from './PasswordResetRequestForm';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeStore';
import { logoutSuccess, logoutStart, loginFail } from '../store/userStore';
import axios from 'axios';

export default function Header() {
    const location = useLocation();
    const path = location.pathname;
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState('login');
    const { currUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleThemeChange = (e) => {
        e.preventDefault();
        dispatch(toggleTheme());
    }

    return (
        <Navbar className='border-b-2'>
            <Link
                to='/'
                className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
            >
                <span 
                    className='px-2 py-1 rounded-lg text-white'
                    style={{
                        backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                    }}
                >
                    Kylie's
                </span>
                Blog
            </Link>
            <form>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button
                    className='w-12 h-10 hidden sm:inline'
                    color='gray'
                    onClick={handleThemeChange}
                    pill
                >
                {theme === 'light'? <FaMoon />: <FaSun />}
                </Button>
                <Link>
                {currUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt='user' img={currUser.photoUrl} rounded />
                        }
                        onClick={(e) => {e.preventDefault()}}
                    >
                        <Dropdown.Header>
                        <span className='block text-sm'>@{currUser.username}</span>
                        <span className='block text-sm font-medium truncate'>
                            {currUser.email}
                        </span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown>
                    ) : (
                    <Button 
                        outline
                        style={{
                            backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                        }}
                        onClick={(e) => {e.preventDefault(); setOpenModal(true); }}
                    >
                        Login
                    </Button>
                    )}
                </Link>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to='/projects'>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
            <Modal openModal={openModal} setOpenModal={setOpenModal}>
                {modalContent === 'login'? <LoginRegisterForm setOpenModal={setOpenModal} setModalContent={setModalContent}/> : <PasswordResetRequestForm setModalContent={setModalContent}/>}
            </Modal>
        </Navbar>
    );
}