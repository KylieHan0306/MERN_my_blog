import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalBox from './Modal';
import { FaCheck, FaTimes } from 'react-icons/fa';
import DeleteUserContent from './DeleteUserContent';
import axios from 'axios';
import errorGenerator from '../utils/errorGenerator';
import { useNavigate } from 'react-router-dom';

export default function DashboardUsers() {
    const { currUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
        const res = await axios.get(`/api/user/${currUser._id}`);
        if (res.status === 200) {
            setUsers(res.data.usersWithoutPass);
            if (res.data.usersWithoutPass.length < 9) {
            setShowMore(false);
            }
        }
        } catch (e) {
    
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }
    };

    useEffect(() => {
        if (currUser.isAdmin) {
            fetchUsers();
        }
    }, [currUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
        const res = await axios.get(`/api/user/${currUser._id}?startIndex=${startIndex}`);
        if (res.status === 200) {
            setUsers((prev) => [...prev, ...data.users]);
            if (data.users.length < 9) {
            setShowMore(false);
            }
        }
        } catch (e) {
    
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await axios.delete(`/api/user/${userIdToDelete}`)
            if (res.status === 200) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                setOpenModal(false);
            }
        } catch (e) {
    
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }
    };

    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {currUser.isAdmin && users.length > 0 ? (
            <>
            <Table hoverable className='shadow-md'>
                <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                </Table.Head>
                {users.map((user) => (
                <Table.Body className='divide-y' key={user._id}>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                        {new Date(user.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                        <img
                            src={user.photoUrl}
                            alt={user.username}
                            className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                        />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                        {user.isAdmin ? (
                        <FaCheck className='text-green-500' />
                        ) : (
                        <FaTimes className='text-red-500' />
                        )}
                    </Table.Cell>
                    <Table.Cell>
                        <span
                            onClick={() => {
                                setOpenModal(true);
                                setUserIdToDelete(user._id);
                            }}
                            className='font-medium text-red-500 hover:underline cursor-pointer'
                        >
                            Delete
                        </span>
                    </Table.Cell>
                    </Table.Row>
                </Table.Body>
                ))}
            </Table>
            {showMore && (
                <button
                onClick={handleShowMore}
                className='w-full text-purple-500 self-center text-sm py-7'
                >
                Show more
                </button>
            )}
            </>
        ) : (
            <p>You have no users yet!</p>
        )}
        <ModalBox openModal={openModal} setOpenModal={setOpenModal}>
            <DeleteUserContent setOpenModal={setOpenModal} handleDeleteUser={handleDeleteUser}/>
        </ModalBox>
        </div>
    );
}