import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import axios from 'axios';
import CodeBox from '../components/CodeBox';
import errorGenerator from '../utils/errorGenerator';

export default function PostPage() {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    const navigate = useNavigate(null);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/post?slug=${slug}`);
            if (res.status !== 200) {
                setLoading(false);
                return;
            } else {
                setPost(res.data.posts[0]);
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }
    };

    const fetchRecentPost = async () => {
        try {
            const res = await axios.get(`/api/post?limit=3`);
            if (res.status === 200) {
              setRecentPosts(res.data.posts);
            }
        } catch (e) {
            setLoading(false);
            const error = errorGenerator();
            navigate('/error', {state: { error }});
        }
    };

    useEffect(() => {
        fetchPost();
    }, [slug]);

    
    useEffect(() => {
        fetchRecentPost();
    }, []);

    return (
    <>
        {loading ? 
        (<div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>) : 
        (<main className='p-3 flex flex-col max-w-[85vw] mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif mx-auto lg:text-4xl'>
                {post && post.title}
            </h1>
            <Link
                to={`/search?category=${post && post.category}`}
                className='self-center mt-5'
            >
                <Button color='gray' pill size='xs'>
                {post && post.category}
                </Button>
            </Link>
            <img
                src={post && post.photoUrl}
                alt={post && post.title}
                className='mt-10 p-3 max-h-[600px] w-full object-cover'
            />
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full text-xs'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>
                {post && (post.content.length / 1000).toFixed(0)} mins read
                </span>
            </div>
            <div
                className='p-3 mx-auto w-full post-content'
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            >
            </div>
                {post.code && 
                    <div
                        className='p-3 mx-auto w-full post-content'
                    >
                        <CodeBox code={post.code} language={post.category}/>            
                    </div>
                }
            <CommentSection postId={post._id} />
            <div className='flex flex-col justify-center items-center mb-5'>
                <h1 className='text-xl mt-5'>Recent articles</h1>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                {recentPosts &&
                    recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </main>)}
    </>);
}