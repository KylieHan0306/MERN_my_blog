import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import DashboardPosts from '../components/DashboardPosts';
import DashboardUsers from '../components/DashboardUsers';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashboardSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashboardProfile />}
      {/* my posts... */}
      {tab === 'my-posts' && <DashboardPosts postType={'my'}/>}
      {/* all posts... */}
      {tab === 'all-posts' && <DashboardPosts postType={'all'}/>}
      {/* users... */}
      {tab === 'users' && <DashboardUsers />}
    </div>
  );
}