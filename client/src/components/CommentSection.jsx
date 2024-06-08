import { Alert, Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import axios from 'axios';
import ModalBox from './Modal';
import DeleteCommentContent from './DeleteCommentContent';

export default function CommentSection({ postId }) {
    const { currUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await axios.post('/api/comment/create', {
                content: comment,
                postId,
                userId: currUser? currUser._id: null,
                parentId: null
            });
            if (res.status === 201) {
                setComment('');
                setCommentError(null);
                setComments([res.data, ...comments]);
            }
        } catch (error) {
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/api/comment/post/${postId}`);
            if (res.status === 200) {
                setComments(res.data);
            }
        } catch (e) {
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) =>
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        );
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setOpenModal(false);
        if (!currUser) return setOpenLoginModal(true);
        try {
            const res = await axios.delete(`/api/comment/delete/${commentToDelete}`)
            if (res.status === 200) {
                setComments(comments.filter((comment) => comment._id !== commentToDelete));
            }
        } catch (error) {
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    };
  
    return (
        <div className='mx-auto w-full p-3'>
        {currUser && (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
            <p>Signed in as:</p>
            <img
                className='h-5 w-5 object-cover rounded-full'
                src={currUser.photoUrl}
                alt=''
            />
            <Link
                to={'/dashboard?tab=profile'}
                className='text-xs text-purple-500 hover:underline'
            >
                @{currUser.username}
            </Link>
            </div>
        )}
        <form
            onSubmit={handleSubmit}
            className='border border-purple-600 rounded-md p-4'
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
                className='bg-custom-gradient'
                type='submit'
            >
                Submit
            </Button>
        </div>
        </form>
        {commentError && (
            <Alert color='failure' className='mt-5'>
            {commentError}
            </Alert>
        )}
        {comments.map((comment) => (
            comment.parentId === null && 
                <Comment
                    key={comment._id}
                    comment={comment}
                    comments={comments.filter((c) => c.parentId !== null)}
                    onEdit={handleEdit}
                    onDelete={(parentId) => {
                        setOpenModal(true);
                        setCommentToDelete(parentId);
                    }}
                    setCommentError={setCommentError}
                />
        ))}
        <ModalBox openModal={openLoginModal} setOpenModal={setOpenLoginModal}>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Please login first
            </h3>
        </ModalBox>
        <ModalBox openModal={openModal} setOpenModal={setOpenModal}>
            <DeleteCommentContent setOpenModal={setOpenModal} handleDelete={handleDelete} />
        </ModalBox>
        </div>
    );
}