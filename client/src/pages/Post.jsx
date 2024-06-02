import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import axios from 'axios';

export default function PostPage() {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/post?slug=${slug}`);
            if (res.status !== 200) {
                setError(true);
                setLoading(false);
                return;
            } else {
                setPost(res.data.posts[0]);
                setLoading(false);
                setError(false);
            }
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [slug]);

    return (
    <>
        {loading ? 
        (<div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>) : 
        (<main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
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
            <CommentSection postId={post._id} />
        </main>)}
    </>);
}