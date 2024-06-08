import { Button, Label, TextInput, Checkbox } from "flowbite-react";
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import errorGenerator from "../utils/errorGenerator";

export default function PasswordResetPage() {
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const queryParams = new URLSearchParams(location.search);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = queryParams.get('token');
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!passwordValidation(password) || password.length === 0) {
      setPasswordError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?\":{}|<>).");
      return false;
    }
    if (password !== confirmPassword ) {
      setPasswordError('Passwords do not match. Please try again.');
      return;
    }
    try {
      const res = await axios.post('/api/auth/reset-password', { token, password });
      if(res.status < 300 && res.status >= 200) {
        setMessage(res.data.message);
      }
    } catch (e) {
        const errorMessage = e.response.data.errMsg;
        if (errorMessage === "Your session has expired. Please redo the changing password process again") {
          const error = errorGenerator('password_reset_expired');
          navigate('/error', {state: { error }});
        }
        setPasswordError(errorMessage);
    } 
  };

  const passwordValidation = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  return (
    <div className="max-w-lg mx-auto ">
      <form className="mt-16 flex-col items-center justify-center">
      <h1 className="text-4xl">Reset your Password</h1>
        <div className="mt-4">
          <Label htmlFor="password" value="New Password" />
          <TextInput
            id="password"
            type={showPassword? "text":"password"} 
            placeholder="Enter new password"
            color={passwordError.length===0? "gray":"failure"}
            helperText={passwordError}
            onChange={(e)=> {setPassword(e.target.value); setPasswordError('');}}
          />
          <div className="flex items-center gap-2">
            <Checkbox id="show password" onChange={()=> {setShowPassword(!showPassword)}}/>
            <Label htmlFor="show password">Show password</Label>
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="confirmPassword" value="Confirm New Password" />
          <TextInput
            id="confirmPassword"
            type={showConfirmPassword? "text":"password"} 
            placeholder="Confirm new password"
            onChange={(e)=> {setConfirmPassword(e.target.value); setPasswordError('');}}
            color={passwordError.length===0? "gray":"failure"}
            helperText={passwordError}
          />
          <div className="flex items-center gap-2">
            <Checkbox id="show confirmed password" onChange={()=> {setShowConfirmPassword(!showConfirmPassword)}}/>
            <Label htmlFor="show confirmed password">Show password</Label>
          </div>
        </div>
        <Button
          outline
          style={{
            backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
          }}
          onClick={handlePasswordReset}
        >
          Reset Password
        </Button>
        {message.length !== 0 && <h3 className="text-green-500">{message}</h3>}
      </form>
    </div>
  );
}