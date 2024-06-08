import { Button, Navbar, TextInput, Dropdown, Avatar  } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import ModalBox from './Modal';
import LoginRegisterForm from "./LoginRegisterForm";
import PasswordResetRequestForm from './PasswordResetRequestForm';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeStore';
import { logoutSuccess, logoutStart, logoutFail } from '../store/userStore';
import axios from 'axios';
import errorGenerator from '../utils/errorGenerator';

export default function Header() {
    const location = useLocation();
    const path = location.pathname;
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState('login');
    const { currUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermInUrl = urlParams.get('searchTerm');
        if (searchTermInUrl) setSearchTerm(searchTermInUrl);
    }, [location.search])

    const handleLogout = async () => {
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
            navigate('/error', {state: { error }});
        }
    }

    const handleThemeChange = (e) => {
        e.preventDefault();
        dispatch(toggleTheme());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const query = urlParams.toString();
        navigate(`/search?${query}`);        
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
            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden md:inline'
                    onChange={(e) => {setSearchTerm(e.target.value)}}
                    value={searchTerm}
                />
            </form>
            <Button className='w-12 h-10 md:hidden' color='gray' pill>
                <AiOutlineSearch onClick={() => {navigate('/search');}}/>
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button
                    className='w-12 h-10 sm:inline'
                    color='gray'
                    onClick={handleThemeChange}
                    pill
                >
                    {theme === 'light'? <FaMoon />: <FaSun />}
                </Button>
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
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/create-post'} as={'div'}>
                    <Link to='/create-post'>Create Posts</Link>
                </Navbar.Link>
            </Navbar.Collapse>
            <ModalBox openModal={openModal} setOpenModal={setOpenModal}>
                {modalContent === 'login'? <LoginRegisterForm setOpenModal={setOpenModal} setModalContent={setModalContent}/> : <PasswordResetRequestForm setModalContent={setModalContent}/>}
            </ModalBox>
        </Navbar>
    );
}