import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import axios from 'axios';
import errorGenerator from '../utils/errorGenerator';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`/api/post?limit=3`);
      if (res.status === 200) {
        setPosts(res.data.posts);
      }
    } catch (e) {
      const error = errorGenerator();
      navigate('/error', {state: {error}});
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <div className='flex gap-6 pt-28 pb-10 px-3 max-w-6xl mx-auto border-b-2 '>
        <div className='flex flex-col max-w-3xl'>
          <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
          <p className='text-gray-500 text-sm sm:text-sm mt-6'>
            I'm thrilled to have you here. Whether you're a seasoned developer or just starting your programming journey, this blog is a place where we can explore the exciting world of coding together.
            Here, you'll find a variety of posts ranging from tutorials and tips to in-depth discussions on programming concepts and best practices. My goal is to share my knowledge and experiences in hopes of helping you learn, grow, and become even more passionate about programming.
            Feel free to browse through the articles, leave comments, and share your thoughts. Your feedback is always appreciated and helps create a vibrant and supportive community here.
            Thank you for visiting, and I look forward to embarking on this coding adventure with you!
          </p>
          <Link
              to='/search'
              className='text-xl sm:text-xl text-purple-500 font-bold hover:underline mt-2'
          >
            View all posts - 
          </Link>
        </div>
        <img 
          className='max-h-xs max-w-xs ml-8 rounded-full border-4 border-gray-400 hidden md:block'
          alt='Kylie/"s photo'
          src={'https://firebasestorage.googleapis.com/v0/b/mern-kylie-blog-189df.appspot.com/o/io1521087%40gmail.comFri%20Jun%2007%202024%2022%3A22%3A29%20GMT%2B1000%20(Australian%20Eastern%20Standard%20Time)me.png?alt=media&token=1d67aeba-9c74-4b36-a15b-f61e95397920'} 
        />
      </div>

      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 py-16 justify-center items-center'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='lg:text-4xl text-xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4 justify-center items-center'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-purple-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}