import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Select, TextInput } from 'flowbite-react';
import PostCard from '../components/PostCard';
import errorGenerator from '../utils/errorGenerator';

export default function Search() {
    const [searchForm, setSearchForm] = useState({
        searchTerm: '',
        order: 'desc',
        user: '',
        category: 'null'
    });
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const navigate = useNavigate();

    useEffect (() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermInUrl = urlParams.get('searchTerm');
        const orderInUrl = urlParams.get('order');
        const categoryInUrl = urlParams.get('category');
        const userInUrl = urlParams.get('user');
        if (searchTermInUrl || orderInUrl || categoryInUrl || userInUrl) {
            setSearchForm({
                ...searchForm,
                searchTerm: searchTermInUrl? searchTermInUrl: '',
                order: orderInUrl? orderInUrl: 'desc',
                category: categoryInUrl? categoryInUrl: 'null',
                user: userInUrl? userInUrl: ''
            });
        }
        fetchPosts();
    }, [location.search]);


    const fetchPosts = async () => {
        const urlParams = new URLSearchParams(location.search);
        const query = urlParams.toString();
        try {
            setLoading(true);
            const res = await axios.get(`/api/post?${query}`);
            if (res.status === 200) {
                setPosts(res.data.posts);
                setLoading(false);
            }
            // no more posts
            if (res.data.posts.length < 6) setShowMore(false);
        } catch (e) {
            setLoading(false);
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }
    }

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSearchForm({ ...searchForm, searchTerm: e.target.value });
        }
        if (e.target.id === 'order') {
            const order = e.target.value || 'desc';
            setSearchForm({ ...searchForm, order: order });
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'null';
            setSearchForm({ ...searchForm, category: category });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        searchForm.searchTerm.length !==0 && urlParams.set('searchTerm', searchForm.searchTerm);
        urlParams.set('order', searchForm.order);
        searchForm.category !== 'null' && urlParams.set('category', searchForm.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async () => {
        const startIndex = posts.length;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        try {
            const res = await axios.get(`/api/post/?${searchQuery}`);
            if (res.status === 200) {
                setPosts([...posts, ...res.data.posts]);
                if (res.data.posts.length === 6) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            } else {
                const error = errorGenerator();
                navigate('/error', {state: { error }});
            }
        } catch (e) {
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }

    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='md:border-r md:min-h-screen min-w-[15vw] border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'>
                <form className='flex flex-col gap-8 mt-6 mr-2 ml-2' onSubmit={handleSubmit}>
                <div className='flex-col'>
                    <label className='whitespace-nowrap font-semibold'>
                        Search Term:
                    </label>
                    <TextInput
                        placeholder='Search...'
                        id='searchTerm'
                        type='text'
                        className='mt-2'
                        value={searchForm.searchTerm}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex-col items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <Select onChange={handleChange} value={searchForm.order} id='order'>
                    <option value='desc'>Latest</option>
                    <option value='asc'>Oldest</option>
                    </Select>
                </div>
                <div className='flex-col items-center gap-2'>
                    <label className='font-semibold'>Category:</label>
                    <Select
                        onChange={handleChange}
                        value={searchForm.category}
                        id='category'
                    >
                        <option value='null'></option>
                        <option value='uncategorized'>Uncategorized</option>
                        <option value='random-staff'>Random staff</option>
                        <option value='c'>C</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='java'>Java</option>
                        <option value='php'>Php</option>
                        <option value='python'>Python</option>
                        <option value='ruby'>Ruby</option>
                        <option value='sass'>Sass</option>
                        <option value='sql'>Sql</option>
                        <option value='swift'>Swift</option>
                        <option value='tsx'>Tsx</option>
                    </Select>
                </div>
                <Button type='submit' outline gradientDuoTone='purpleToPink'>
                    Apply Filters
                </Button>
                </form>
            </div>
            <div className='w-full'>
                <div className='p-7 flex flex-wrap gap-4'>
                {!loading && posts.length === 0 && (
                    <p className='text-xl text-gray-500'>No posts found.</p>
                )}
                {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                {!loading &&
                    posts &&
                    posts.map((post) => <PostCard key={post._id} post={post} />)}
                {showMore && (
                    <button
                        onClick={handleShowMore}
                        className='text-purple-500 text-lg hover:underline p-7 w-full'
                    >
                        Show More
                    </button>
                )}
                </div>
            </div>
        </div>
    )
}
