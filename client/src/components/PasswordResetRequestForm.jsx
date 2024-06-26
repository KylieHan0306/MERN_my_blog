import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from 'axios';

export default function PasswordResetRequestForm() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            setEmailError('Please enter a valid email');
        }
        try {
            setLoading(true);
            const res = await axios.post("/api/auth/request-reset-password", {email});
            if(res.status < 300 && res.status >= 200) {
                setSuccess(res.data.message);
                setLoading(false);
                setEmailSent(true);
            } else {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            const errorMessage = e.response.data.errMsg;
            setEmailError(errorMessage)
        }
    }
    const handleChange = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
        setEmailError('');
    }
    return (
        <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Reset Your Password</h2>
        <form className="mt-4">
            <div className="mb-4">
            <Label htmlFor="email" value="Email" />
            <TextInput
                id="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                color={emailError.length===0? "gray":"failure"}
                helperText={emailError}
                value={email}
                required
            />
            </div>
            <Button 
                outline
                type="submit"
                className="bg-custom-gradient"
                onClick={handleReset}
                disabled={loading || emailSent}
            >
            {loading? 
                <>
                    <Spinner size={'sm'}/>
                    <span className="pl-3">Loading...</span>
                </>: 
                ('Send Reset Link')
            }    
            </Button>
        </form>
        {success.length !== 0 && <h3 className="text-green-500">{success}</h3>}
        </div>
    );
}