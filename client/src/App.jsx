import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import PasswordReset from './pages/PasswordReset'
import EmailVerify from './pages/EmailVerify'
import EmailVerifySuccess from './pages/EmailVerifySuccess'
import PrivateRoute from './components/PrivateRoute'
import Post from './pages/Post'
import UpdatePost from './pages/UpdatePost'
import CreatePost from './pages/CreatePost'
import Error from './pages/Error'
import ScrollTop from './components/ScrollTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/email-verify" element={<EmailVerify />} /> 
        <Route path="/email-change" element={<EmailVerify />} /> 
        <Route path="/email-verify-success" element={<EmailVerifySuccess />} /> 
        <Route path="/error" element={<Error />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<PrivateRoute />}>
          <Route path="/reset-password" element={<PasswordReset />} /> 
        </Route>
        {/*<Route element={<AdminRoute />}>*/}
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        {/*</Route>*/}
        <Route path="/post/:slug" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}
