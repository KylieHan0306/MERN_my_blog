import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { loginSuccess, loginStart, loginFail } from "../store/userStore";
import { useDispatch, useSelector } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';

export default function LoginRegisterForm ({ setOpenModal, setModalContent }) {
    const [register, setRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [ emailSent, setEmailSent ] = useState(false);
    const { loading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);

    
    const errorHandle = (e) => {
      const errorMessage = e.response.data.errMsg;
      setLoading(false);
      if (errorMessage === "Your verification session has expired.") {
          setError(errorMessage); 
          return;
      }
      navigate('/error', { state: { errorMessage } });
  }

    
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
    }
    
    const validateUsername = (register, username) => {
        if (register && username?.length === 0) {
            setUsernameError("Username cannot be empty");
            return false;
        }
        return true;
    };
      
    const validateEmail = (email) => {
        if (email.length === 0 || !emailValidation(email)) {
            setEmailError("Please enter a valid email");
            return false;
        }
        return true;
    };
      
    const validatePassword = (register, password) => {
        if (password.length === 0) {
            setPasswordError("Please enter a valid password");
            return false;
        }
        if (register && !passwordValidation(password)) {
            setPasswordError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?\":{}|<>).");
            return false;
        }
        return true;
    };
    
    const passwordValidation = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };
    
    const emailValidation = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = register ? "/api/auth/register" : "/api/auth/login";
        const isUsernameValid = validateUsername(register, formData.username);
        const isEmailValid = validateEmail(formData.email);
        const isPasswordValid = validatePassword(register, formData.password);
    
        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            dispatch(loginFail());
            return;
        }
        try {
            dispatch(loginStart())
            const res = await axios.post(endpoint, formData);
            if(res.status < 300 && res.status >= 200) {
                dispatch(loginSuccess(res.data));
                if (!register) {
                  onCloseModal();
                } else {
                  setEmailSent(true);
                }
            }
        } catch (e) {
            dispatch(loginFail());
            const errorMessage = e.response.data.errMsg;
            // duplicate key error
            if (errorMessage.indexOf('E11000') !== -1) {
                errorMessage.indexOf('email') !== -1 ? setEmailError('Email already taken') : setUsernameError('Username already taken');
                dispatch(loginFail());
                return;
            }
            setEmailError(errorMessage);
            setPasswordError(errorMessage);
            dispatch(loginFail());
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
        setEmailSent(false);
        dispatch(loginFail());
        setRegister(!register);
    }
      
    const handleOAuth = async (e) => {
      e.preventDefault();
      onCloseModal();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account '});
      try {
        const resG = await signInWithPopup(auth, provider);
        const resB = await axios.post('/api/auth/google', {
          name: resG.user.displayName,
          email: resG.user.email,
          photoUrl: resG.user.photoURL,
        });
        if (resB.status >= 200 && resB.status < 300) {
          dispatch(loginSuccess(resB.data))
        }
      } catch (e) {
        errorHandle(e);
      }
    }
    return (
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
                type={showPassword? "text":"password"} 
                placeholder="**********"
                onChange={handleChange}
                color={passwordError.length===0? "gray":"failure"}
                helperText={passwordError}
                value={formData.password}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="show password" onChange={()=> {setShowPassword(!showPassword)}}/>
                <Label htmlFor="show password">Show password</Label>
              </div>
              <a className="text-sm text-cyan-700 hover:underline dark:text-cyan-500" onClick={() => {setModalContent('password')}}>
                Lost Password?
              </a>
            </div>
            <Button 
              outline
              onClick={handleSubmit}
              style={{
                backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
              }}
              disabled={loading || emailSent}
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
              className="border-2 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-500"
              onClick={handleOAuth}
            >
              <FaGoogle className="mr-2 mt-1 dark:white" />
              Sign in with Google
            </Button>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                {register? "Have an account? " : "Not registered?"}
              <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500" onClick={handleTypeChange}>
                {register? "Login": "Register" }
              </a>
            </div>
            {emailSent && <h3 className="text-green-500">Verification email sent. Please check your inbox.</h3>}
        </form>
    )
    
}