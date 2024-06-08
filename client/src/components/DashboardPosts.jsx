import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import ModalBox from './Modal';
import DeletePostContent from './DeletePostContent';
import { useNavigate } from 'react-router-dom';
import errorGenerator from '../utils/errorGenerator';

export default function DashboardPosts({ postType }) {
  const [posts, setPosts] = useState([]);
  const { currUser } = useSelector((state)=> state.user);
  const [openModal, setOpenModal] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const endPoint = postType === 'all'? `/api/post?limit=9`: `/api/post?userId=${currUser?._id}?limit=9`;
      const res = await axios.get(endPoint);
      if (res.status === 200) setPosts(res.data.posts);
      // no more posts
      if (res.data.posts.length < 9) setShowMore(false);
    } catch (e) {
      const error = errorGenerator();
      navigate('/error', {state: {error}});
    }
  }

  const handleDeletePost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/api/post/delete/${currUser._id}/${deleteId}`);
      if (res.status === 200) {
        if (posts.length -1 < 9) setShowMore(false);
        setPosts((prev)=> prev.filter((post)=> post._id !== deleteId));
        setOpenModal(false);
      }
    } catch (e) {
      const error = errorGenerator();
      navigate('/error', {state: {error}});
    }
  }

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const endPoint = postType === 'all'? `/api/post?startIndex=${startIndex}`: `/api/post?userId=${currUser._id}&startIndex=${startIndex}`;
      const res = await axios.get(endPoint);
      if (res.status === 200) {
          setPosts((prev) => [...prev, ...res.data.posts]);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (e) {
      const error = errorGenerator();
      navigate('/error', {state: {error}});
    }
  };
  
  useEffect(() => {
    fetchPosts();
  },[currUser?._id])
  
  return (
    <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {posts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Owner</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              {/* User can ony edit their own post */}
              {postType !== 'all' && 
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              }
            </Table.Head>
            {posts.map((post) => (
              <Table.Body className='divide-y' key={post._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.photoUrl}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>{post.owner}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setDeleteId(post._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  {postType !== 'all' && 
                    <Table.Cell>
                      <Link
                        className='text-blue-500 hover:underline'
                        to={`/update-post/${post._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  }
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
        <p>You have no posts yet!</p>
      )}
      <ModalBox openModal={openModal} setOpenModal={setOpenModal}>
        <DeletePostContent setOpenModal={setOpenModal} handleDeletePost={handleDeletePost}/>
      </ModalBox>
    </div>
  );
}
