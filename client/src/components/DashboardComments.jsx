import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ModalBox from './Modal';
import DeleteCommentContent from '../components/DeleteCommentContent';
import { useNavigate } from 'react-router-dom';
import errorGenerator from '../utils/errorGenerator';

export default function DashboardComments() {
  const { currUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/comment/all`);
      if (res.status) {
        setComments(res.data.comments);
        if (res.data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (e) {
      const error = errorGenerator();
      navigate('/error', {state: {error}});
    }
  };

  useEffect(() => {
    if (currUser.isAdmin) {
      fetchComments();
    }
  }, [currUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(`/api/comment/all?startIndex=${startIndex}`);
      if (res.status === 200) {
        setComments((prev) => [...prev, ...res.data.comments]);
        if (res.data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (e) {
      const error = errorGenerator();
      navigate('/error', {state: {error}});
    }
  };

  const handleDeleteComment = async () => {
    setOpenModal(false);
    try {
      const res = await axios.delete(`/api/comment/delete/${commentIdToDelete}`);
      if (res.status === 200) {
        // There maybe nested comments also been deleted, so re-fetch 
        await fetchComments();
        setOpenModal(false);
      } else {
        const error = errorGenerator();
        navigate('/error', {state: {error}});
      }
    } catch (e) {
      const error = errorGenerator();
      navigate('/error', {state: {error}});
    }
  };

  return (
    <div className='table-auto w-full overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>ParentId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className='divide-y' key={comment._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell className='md:w-[10%]'>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className='md:w-[40%]'>{comment.content}</Table.Cell>
                  <Table.Cell className='md:w-[10%]'>{comment.likes.length}</Table.Cell>
                  <Table.Cell className='md:w-[10%]'>{comment.postId.toString()}</Table.Cell>
                  <Table.Cell className='md:w-[10%]'>{comment.userId.toString()}</Table.Cell>
                  <Table.Cell className='md:w-[10%]'>{comment.parentId? comment.parentId:'No parent comment'}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setCommentIdToDelete(comment._id);
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
        <p>You have no comments yet!</p>
      )}
      <ModalBox openModal={openModal} setOpenModal={setOpenModal}>
          <DeleteCommentContent setOpenModal={setOpenModal} handleDelete={handleDeleteComment} />
      </ModalBox>
    </div>
  );
}