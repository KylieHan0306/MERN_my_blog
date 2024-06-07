import { Link, useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
    const navigate = useNavigate();

    return (
        <div className='group relative w-full border border-gray-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[25vw] transition-all'>
        <Link to={`/post/${post.slug}`}>
            <img
                src={post.photoUrl}
                alt='post cover'
                className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
            />
        </Link>
        <div className='p-3 flex flex-col gap-2'>
            <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
            <span className='font-semibold text-sm hover:underline hover:text-purple-600' onClick={() => {navigate(`/search?searchTerm=${post.owner}`)}}>{'@' + post.owner}</span>
            <span className='italic text-sm hover:text-purple-600' onClick={() => {navigate(`/search?category=${post.category}`)}}>{post.category}</span>
            <Link
                to={`/post/${post.slug}`}
                className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-gray-500 text-gray-500 hover:bg-purple-600 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
            >
                Read article
            </Link>
        </div>
        </div>
    );
}