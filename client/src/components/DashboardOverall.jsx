import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DashboardOverall() {

    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/api/comment/all?limit=5`);
            if (res.status) {
                setComments(res.data.comments);
                setTotalComments(res.data.commentsCount);
                setLastMonthComments(res.data.commentsLastCount);
            }
        } catch (error) {
            console.error(error);
            navigate('/error', {state: {errorMessage: 'Unable to reach the server. Please ensure you are connected to the internet, or try again later.'}});
        }
    };
    
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`/api/user/${currUser._id}`);
            if (res.status === 200) {
                setUsers(res.data.usersWithoutPass);
                setTotalUsers(res.data.usersCount);
                setLastMonthUsers(res.data.usersLastMonth);
            }
        } catch (error) {
            console.error(error);
            navigate('/error', {state: {errorMessage: 'Unable to reach the server. Please ensure you are connected to the internet, or try again later.'}});
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`/api/post?limit=5`);
            if (res.status === 200) {
                setPosts(res.data.posts);
                setTotalPosts(res.data.totalPosts);
                setLastMonthPosts(res.data.lastMonthPosts);
            }
        } catch (error) {
            console.error(error);
            navigate('/error', {state: {errorMessage: 'Unable to reach the server. Please ensure you are connected to the internet, or try again later.'}});
        }
    }

    useEffect(() => {
        if (currUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currUser]);

    return (
        <div className='p-3 w-full'>
            <div className='flex-wrap flex gap-4 justify-center w-full'>
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-[32%] w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                        <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                        <p className='text-2xl'>{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                        <HiArrowNarrowUp />
                        {lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-[32%] w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                        <h3 className='text-gray-500 text-md uppercase'>
                            Total Comments
                        </h3>
                        <p className='text-2xl'>{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                        <HiArrowNarrowUp />
                        {lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-[32%] w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                        <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                        <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                        <HiArrowNarrowUp />
                        {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center w-full'>
                <div className='flex flex-col w-full md:w-[41%] shadow-md p-2 rounded-md dark:bg-gray-800'>
                <div className='flex justify-between  p-3 text-sm font-semibold'>
                    <h1 className='text-center p-2'>Recent users</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                    <Link to={'/dashboard?tab=users'}>See all</Link>
                    </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                        <Table.HeadCell>User image</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                        <Table.HeadCell>Date Registered</Table.HeadCell>
                        </Table.Head>
                        {users && users.map((user) => (
                            <Table.Body key={user._id} className='divide-y'>
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                <Table.Cell>
                                <img
                                    src={user.photoUrl}
                                    alt='user'
                                    className='w-10 h-10 rounded-full bg-gray-500'
                                />
                                </Table.Cell>
                                <Table.Cell>{user.username}</Table.Cell>
                                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                            </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-[56%] shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent comments</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                        <Link to={'/dashboard?tab=comments'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                        <Table.HeadCell>Comment content</Table.HeadCell>
                        <Table.HeadCell>Likes</Table.HeadCell>
                        <Table.HeadCell>Date updated</Table.HeadCell>
                        </Table.Head>
                        {comments &&
                        comments.map((comment) => (
                            <Table.Body key={comment._id} className='divide-y'>
                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                <Table.Cell className='w-96'>
                                    <p className='line-clamp-2'>{comment.content}</p>
                                </Table.Cell>
                                <Table.Cell>{comment.likes.length}</Table.Cell>
                                <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                            </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className='flex flex-col w-full md:w-[98%] shadow-md p-2 rounded-md dark:bg-gray-800'>
                <div className='flex justify-between  p-3 text-sm font-semibold'>
                    <h1 className='text-center p-2'>Recent posts</h1>
                    <Button outline gradientDuoTone='purpleToPink'>
                    <Link to={'/dashboard?tab=all-posts'}>See all</Link>
                    </Button>
                </div>
                <Table hoverable>
                    <Table.Head>
                    <Table.HeadCell>Post image</Table.HeadCell>
                    <Table.HeadCell>Post Title</Table.HeadCell>
                    <Table.HeadCell>Author</Table.HeadCell>
                    <Table.HeadCell>Category</Table.HeadCell>
                    <Table.HeadCell>DATE UPDATED</Table.HeadCell>
                    </Table.Head>
                    {posts &&
                    posts.map((post) => (
                        <Table.Body key={post._id} className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell className='w-[15%]'>
                                <img
                                    src={post.photoUrl}
                                    alt='user'
                                    className='h-10 rounded-md bg-gray-500'
                                />
                            </Table.Cell>
                            <Table.Cell className='w-[30%]'>{post.title}</Table.Cell>
                            <Table.Cell className='w-[15%]'>{post.owner}</Table.Cell>
                            <Table.Cell className='w-[15%]'>{post.category}</Table.Cell>
                            <Table.Cell className='w-[15%]'>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                        </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
                </div>
            </div>
        </div>
    );
}