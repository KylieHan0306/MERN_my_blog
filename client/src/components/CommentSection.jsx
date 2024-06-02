import { Alert, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import axios from 'axios';
import ModalBox from './Modal';

export default function CommentSection({ postId }) {
    const { currUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!currUser) return setOpenLoginModal(true);
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await axios.post('/api/comment/create', {
                content: comment,
                postId,
                userId: currUser._id,
            });
            console.log(res.data);
            if (res.status === 201) {
                setComment('');
                setCommentError(null);
                setComments([res.data, ...comments]);
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/api/comment/${postId}`);
            if (res.status === 200) {
                setComments(res.data);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleLike = async (commentId) => {
        try {
            if(!currUser) return setOpenLoginModal(true);
            const res = await axios.put(`/api/comment/like/${commentId}`);
            if (res.status === 200) {
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                        ? {
                            ...comment,
                            likes: res.data.likes,
                        }
                        : comment
                    )       
                );
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) =>
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        );
    };

    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
            if (!currUser) setOpenLoginModal(true);
        } catch (error) {
            console.log(error.message);
        }
    };
  
    return (
        <div className='mx-auto w-full p-3'>
        {currUser ? (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
            <p>Signed in as:</p>
            <img
                className='h-5 w-5 object-cover rounded-full'
                src={currUser.photoUrl}
                alt=''
            />
            <Link
                to={'/dashboard?tab=profile'}
                className='text-xs text-cyan-600 hover:underline'
            >
                @{currUser.username}
            </Link>
            </div>
        ) : (
            <div className='text-sm text-teal-500 my-5 flex gap-1'>
            You must be signed in to comment.
            <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                Sign In
            </Link>
            </div>
        )}
        {currUser && (
            <form
                onSubmit={handleSubmit}
                className='border border-teal-500 rounded-md p-4'
            >
            <Textarea
                placeholder='Add a comment...'
                rows='3'
                maxLength='200'
                onChange={(e) => setComment(e.target.value)}
                value={comment}
            />
            <div className='flex justify-between items-center mt-5'>
                <p className='text-gray-500 text-xs'>
                {200 - comment.length} characters remaining
                </p>
                <Button 
                    outline                 
                    style={{
                        backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                    }} 
                    type='submit'
                >
                    Submit
                </Button>
            </div>
            {commentError && (
                <Alert color='failure' className='mt-5'>
                {commentError}
                </Alert>
            )}
            </form>
        )}
        {comments.map((comment) => (
            <Comment
                key={comment._id}
                comment={comment}
                handleLike={handleLike}
                onEdit={handleEdit}
                onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                }}
            />
        ))}
        <ModalBox openModal={openLoginModal} setOpenModal={setOpenLoginModal}>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Please login first
            </h3>
        </ModalBox>
        </div>
    );
}