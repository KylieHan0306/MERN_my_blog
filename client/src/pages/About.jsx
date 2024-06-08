export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Kylie' Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
                Welcome to Kylie's Blog! This space was created by me as a personal project to express my ideas and perspectives with everyone. 
                I am an enthusiastic developer who enjoys discussing programming, technologies and etc.
            </p>

            <p>
                On this blog, you'll find a diverse array of posts on a weekly basis, focusing on topics like coding, programming, and various aspects of technology. 
                With contributions from both myself and other users, there's always something new and exciting to explore, so do visit often for the latest updates!
            </p>

            <p>
              We encourage you to leave comments on our posts and engage in conversations with other readers. You can show your appreciation for comments by liking them and join in discussions. We believe in cultivating a community where everyone can learn, share, and grow together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}