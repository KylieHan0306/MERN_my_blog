import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import PasswordReset from './pages/PasswordReset'
import EmailVerify from './pages/EmailVerify'
import EmailVerifySuccess from './pages/EmailVerifySuccess'
import Error from './pages/Error'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/reset-password" element={<PasswordReset />} /> 
        <Route path="/email-verify" element={<EmailVerify />} /> 
        <Route path="/email-verify-success" element={<EmailVerifySuccess />} /> 
        <Route path="/error" element={<Error />} /> 
      </Routes>
    </BrowserRouter>
  )
}
