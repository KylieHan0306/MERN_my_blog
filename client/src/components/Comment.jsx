import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea, TextInput } from 'flowbite-react';
import axios from 'axios';
import ModalBox from './Modal';
import DeleteCommentContent from './DeleteCommentContent';


export default function Comment({ comment, comments, onDelete, setCommentError }) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [replying, setReplying] = useState(false);
    const { currUser } = useSelector((state) => state.user);
    const [nestedComment, setNestedComment] = useState(null);
    const [nestedComments, setNestedComments] = useState(comments);
    const [commentState, setCommentState] = useState(comment);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    
    const getUser = async () => {
        try {
            const res = await axios.get(`/api/user/getuser/${comment.userId}`);
            if (res.status === 200) {
                setUser(res.data);
            }
        } catch (error) {
            //if user deleted their account, print user not exist and default avatar
            if (error.response.status === 404) setUser({ username: 'user not exist', photoUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'});
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    };

    useEffect(() => {
        getUser();
    }, [comment]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/comment/update/${comment._id}`, {content: editedContent, userId: comment.userId});
            if (res.status === 200) {
                setIsEditing(false);
                setCommentState(res.data);
            }
        } catch (error) {
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    }
    
    const addNestedComments = async (e) => {
        e.preventDefault();

        const newNestedComment = {
            content: nestedComment,
            postId: comment.postId,
            userId: currUser._id,
            parentId: comment._id
        };
        if(!currUser) return setOpenLoginModal(true);
        if (nestedComment.length > 200) {
            return;
        }
        try {
            const res = await axios.post('/api/comment/create', newNestedComment);
            if (res.status === 201) {
                setNestedComments([...nestedComments, res.data]);
                setNestedComment('');
                setReplying(false);
            }
        } catch (error) {
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    }

    const handleLike = async (commentId) => {
        try {
            if(!currUser) return setOpenLoginModal(true);
            const res = await axios.put(`/api/comment/like/${commentId}`);
            if (res.status === 200) {
                setCommentState(res.data);
            }
        } catch (error) {
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setOpenModal(false);
        if (!currUser) return setOpenLoginModal(true);
        try {
            const res = await axios.delete(`/api/comment/delete/${commentToDelete}`)
            if (res.status === 200) {
                setNestedComments(nestedComments.filter((comment) => comment._id !== commentToDelete));
                setCommentToDelete(null);
            }
        } catch (error) {
            setCommentError('Unable to reach the server. Please ensure you are connected to the internet, or try again later.');
        }
    };
  
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className='flex-shrink-0 mr-3'>
            <img
            className='w-10 h-10 rounded-full bg-gray-200'
            src={user.photoUrl}
            alt={user.username}
            />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-xs truncate'>
                {user ? `@${user.username}` : 'anonymous user'}
            </span>
            <span className='text-gray-500 text-xs'>
                {moment(commentState.createdAt).fromNow()}
            </span>
            </div>
            {isEditing ? (
            <>
                <Textarea
                    className='mb-2'
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className='flex justify-end gap-2 text-xs'>
                <Button
                    type='button'
                    size='sm'
                    style={{
                        backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                    }}
                    outline
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Button
                    type='button'
                    size='sm'
                    color="white"
                    className="border-2 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-500"
                    onClick={() => setIsEditing(false)}
                >
                    Cancel
                </Button>
                </div>
            </>
            ) : (
            <>
                <p className='text-gray-500 pb-2'>{commentState.content}</p>
                <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                <button
                    type='button'
                    onClick={() => handleLike(comment._id)}
                    className={`text-gray-400 hover:text-blue-500 ${
                    currUser && commentState.likes.includes(currUser._id) &&
                        '!text-blue-500'
                    }`}
                >
                    <FaThumbsUp className='text-sm' />
                </button>
                <p className='text-gray-400'>
                    {commentState.likes.length > 0 &&
                    commentState.likes.length +
                        ' ' +
                        (commentState.likes.length === 1 ? 'like' : 'likes')}
                </p>
                <button
                    type='button'
                    onClick={()=> {setReplying(true)}}
                    className='text-gray-400 hover:text-blue-500'
                >
                    Reply
                </button>
                {(currUser._id === comment.userId) && (
                    <>
                        <button
                            type='button'
                            onClick={() => {setIsEditing(true)}}
                            className='text-gray-400 hover:text-blue-500'
                        >
                            Edit
                        </button>
                        <button
                            type='button'
                            onClick={() => onDelete(comment._id)}
                            className='text-gray-400 hover:text-red-500'
                        >
                            Delete
                        </button>
                    </>
                )}
                </div>
                {replying &&
                <div className='pt-2 flex-col'> 
                    <TextInput 
                        placeholder='Add some reply...'
                        onChange={(e) => setNestedComment(e.target.value)}
                    />
                    <div className='flex pt-2 justify-end'>
                        <Button
                            outline
                            type='button'
                            size='xs'
                            className="h-8 justify-center items-center mr-2"
                            onClick={addNestedComments}
                            style={{
                                backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                            }}
                        >
                            Reply
                        </Button>
                        <Button
                            type='button'
                            size='xs'
                            color="white"
                            onClick={()=>{setReplying(false)}}
                            className="border-2 h-8 justify-center items-center hover:bg-gray-200 dark:text-white dark:hover:bg-gray-500"
                        >
                            Cancel
                        </Button>
                    </div>

                </div>}
            </>
            )}
            {nestedComments.map((curr) => 
                curr.parentId === comment._id && 
                <Comment
                    key={curr._id}
                    comment={curr}
                    comments={comments.filter((curr) => curr.parentId !== comment._id)}
                    onDelete={(id) => {
                        setOpenModal(true);
                        setCommentToDelete(id);
                    }}
                    setCommentError={setCommentError}
                />
            )}
        </div>
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