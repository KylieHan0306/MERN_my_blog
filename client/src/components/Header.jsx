import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import Modal from './Modal';
import LoginRegisterForm from "./LoginRegisterForm";
import PasswordResetRequestForm from './PasswordResetRequestForm';
import { useState } from 'react';

export default function Header() {
    const path = useLocation().pathname;
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState('login');

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
                    pill
                >
                <FaMoon />
                </Button>
                <Link>
                    <Button 
                        outline
                        style={{
                            backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                        }}
                        onClick={() => {setOpenModal(true)}}
                    >
                        Login
                    </Button>
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