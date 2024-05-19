import { Button, Checkbox, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

export default function LoginRegisterModal({ register, setRegister, openModal, setOpenModal }) {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value.trim() }));
  
    switch (id) {
      case 'email':
        setEmailError('');
        break;
      case 'username':
        setUsernameError('');
        break;
      case 'password':
        setPasswordError('');
        break;
      default:
        break;
    }
  };

  const onCloseModal = () =>  {
    setOpenModal(false);
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = register ? "/api/auth/register" : "/api/auth/login";
    if (register && formData.username?.length === 0) {
      setUsernameError("Username field cannot be empty"); 
      return;
    }
    if (formData.email.length === 0) {
      setEmailError("Email field cannot be empty");
      return;
    }
    if (formData.password.length === 0) {
      setPasswordError("Password field cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(endpoint, formData);
      console.log(res);
      setLoading(false);
    } catch (e) {
      const errorMessage = e.response.data.errMsg;
      console.log(errorMessage)
      // duplicate key error
      if (errorMessage.indexOf('E11000') !== -1) {
        errorMessage.indexOf('email') !== -1 ? setEmailError('Email already taken') : setUsernameError('Username already taken');
        setLoading(false);
        return;
      }
      if (register) {
        setUsernameError(errorMessage);
      }
      setEmailError(errorMessage);
      setPasswordError(errorMessage);
      setLoading(false);
    }
  };

  const handleTypeChange = () => {
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setEmailError('');
    setPasswordError('');
    setUsernameError('');
    setLoading(false);
    setRegister(!register);
  }

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form className="flex max-w-md flex-col gap-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white" > {register? "Register":"Login"} </h3> 
            {register && <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Your username" />
              </div>
              <TextInput
                id="username"
                placeholder="username"
                onChange={handleChange}
                color={usernameError.length===0? "gray":"failure"}
                helperText={usernameError}
                value={formData.username}
              />
            </div>}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@company.com"
                onChange={handleChange}
                color={emailError.length===0? "gray":"failure"}
                helperText={emailError}
                value={formData.email}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput 
                id="password" 
                type="password" 
                placeholder="**********"
                onChange={handleChange}
                color={passwordError.length===0? "gray":"failure"}
                helperText={passwordError}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                Lost Password?
              </a>
            </div>
            <Button 
              outline
              onClick={handleSubmit}
              style={{
                backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
              }}
              type="submit"
              disabled={loading}
            >
              {loading? 
              <>
                <Spinner size={'sm'}/>
                <span className="pl-3">Loading...</span>
              </>:
              (register ? "Register for a new account" : "Log in to your account")}
            </Button>
            <Button
              color="white"
              className="border-2 hover:border-10"
            >
              <FaGoogle className="mr-2 mt-1" />
              Sign in with Google
            </Button>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                {register? "Have an account? " : "Not registered?"}
              <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500" onClick={handleTypeChange}>
                {register? "Login": "Register" }
              </a>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}