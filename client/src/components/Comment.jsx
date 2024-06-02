import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import axios from 'axios';

export default function Comment({ comment, handleLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currUser } = useSelector((state) => state.user);

    const getUser = async () => {
        try {
            const res = await axios.get(`/api/user/getuser/${comment.userId}`);
            if (res.status === 200) {
                setUser(res.data);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getUser();
    }, [comment]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/comment/update/${comment._id}`, {content: editedContent, userId: comment.userId});
            if (res.status === 200) {
                onEdit(comment, editedContent);
                setIsEditing(false);
            }
        } catch (error) {
            console.error(error);
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
                {moment(comment.createdAt).fromNow()}
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
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Button
                    type='button'
                    size='sm'
                    style={{
                        backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                    }}
                    outline
                    onClick={() => setIsEditing(false)}
                >
                    Cancel
                </Button>
                </div>
            </>
            ) : (
            <>
                <p className='text-gray-500 pb-2'>{comment.content}</p>
                <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                <button
                    type='button'
                    onClick={() => handleLike(comment._id)}
                    className={`text-gray-400 hover:text-blue-500 ${
                    currUser &&
                    comment.likes.includes(currUser._id) &&
                        '!text-blue-500'
                    }`}
                >
                    <FaThumbsUp className='text-sm' />
                </button>
                <p className='text-gray-400'>
                    {comment.numberOfLikes > 0 &&
                    comment.numberOfLikes +
                        ' ' +
                        (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                </p>
                {currUser &&
                    (currUser._id === comment.userId) && (
                    <>
                        <button
                        type='button'
                        onClick={handleEdit}
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
            </>
            )}
        </div>
        </div>
    );
}