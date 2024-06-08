import { Alert, Button, TextInput, Checkbox, Label } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import ModalBox from './Modal';
import DeleteUserForm from './DeleteUserForm';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import errorGenerator from '../utils/errorGenerator';
import { logoutStart, logoutSuccess, logoutFail, updateFail, updateStart, updateSuccess } from '../store/userStore';

export default function DashboardProfile() {
    const { currUser, loading } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [emailSent, setEmailSent] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const imgRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // In case the user change their email and finished the verification process
    const fetchUser = async () => {
        try {
            dispatch(updateStart());
            const res = await axios.get(`/api/user/getuser/${currUser._id}`);
            if (res.status === 200) {
                dispatch(updateSuccess(res.data));
            } else {
                dispatch(updateFail());
            }
        } catch (e) {
            const error = errorGenerator();
            dispatch(updateFail());
            navigate('/error', {state: {error}});
        }
    };

    useEffect(() => {
        fetchUser();
    }, [])

    const handleChange = (e) => {
        setUpdateUserSuccess(null);
        setUploadError(null);
        setEmailSent(null);
        setUpdateError(null);
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateStart());
            if (photoUrl) formData.photoUrl = photoUrl;
            const res = await axios.put(`/api/user/${currUser?._id}`, formData);
            if(res.data.message === 'Please verify your new email') {
                setEmailSent(res.data.message);
            }
            if(formData.username || formData.photoUrl || formData.password) setUpdateUserSuccess('Your profile updated successfully!');
            dispatch(updateSuccess(res.data.user));
        } catch(e) {
            dispatch(updateFail());
            const errorMessage = e.response.data.errMsg;
            setUpdateError('Update fail: '+ errorMessage);
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            dispatch(logoutStart());
            const res = await axios.get('/api/auth/logout');
            if (res.status >= 200 && res.status < 300) {
                navigate('/');
                dispatch(logoutSuccess());
            }
        } catch (e) {
            dispatch(logoutFail());
            const error = errorGenerator();
            navigate('/error', {state: {error}});
        }
    }

    const handlePhotoUpload = async (e) => {
        const photo = e.target.files[0];
        if (photo) {
            try{
                setUploadError(null);
                setPhotoUrl(URL.createObjectURL(photo));
                const storage = getStorage(app);
                const photoName = currUser?.email + new Date() + photo.name;
                const storageRef = ref(storage, photoName);
                const upload = uploadBytesResumable(storageRef, photo);
                upload.on(
                    'state_changed',
                    (snapshot) => {
                        setUploadProgress(((snapshot.bytesTransferred/snapshot.totalBytes) * 100).toFixed(0));
                    },
                    (error) => {
                        setUploadError('Could not upload photo, file must be less than 2MB');
                        setUploadProgress(null);
                        setPhotoUrl(null);
                    },
                    () => {
                        getDownloadURL(upload.snapshot.ref).then((url)=>{ setPhotoUrl(url) });
                    }
                )
            } catch (e) {
                setUploadError('An error occurred while uploading the image.');
            }
        } else {
          setUploadError('Please upload an image');
        }
    };

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <input
                type='file'
                accept='image/*'
                ref={imgRef}
                onChange={handlePhotoUpload}
                hidden
            />
            <div
                className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
                alt="profile photo"
                onClick={()=> {imgRef.current.click()}}
            >
                {(uploadProgress && uploadProgress < 100) && (
                    <CircularProgressbar
                        value={uploadProgress || 0}
                        text={`${uploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root: {
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            },
                            path: {
                            stroke: `rgba(62, 152, 199, ${
                                uploadProgress / 100
                            })`,
                            },
                        }}
                    />
                )}
                <img
                    src={photoUrl? photoUrl: currUser?.photoUrl}
                    alt='user'
                    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                        uploadProgress  &&
                        uploadProgress < 100 &&
                        'opacity-60'
                    }`}
                />
            </div>
            {uploadError && <Alert color = 'failure'>{uploadError}</Alert>}
            {updateError && <Alert color = 'failure'>{updateError}</Alert>}
            {emailSent && <Alert color = 'success'>{emailSent}</Alert>}
            {updateUserSuccess && <Alert color = 'success'>{updateUserSuccess}</Alert>}
            <TextInput
                type='text'
                id='username'
                placeholder='username'
                defaultValue={currUser?.username}
                onChange={handleChange}
            />
            <TextInput
                type='email'
                id='email'
                placeholder='email'
                defaultValue={currUser?.email}
                onChange={handleChange}
            />
            <TextInput
                type={showPassword? 'text':'password'}
                id='password'
                placeholder='password'
                onChange={handleChange}
            />
            <div className="flex items-center gap-2">
                <Checkbox id="show password" onChange={()=> {setShowPassword(!showPassword)}}/>
                <Label htmlFor="show password">Show password</Label>
            </div>
            <Button
                type='submit'
                outline
                disabled={loading}
                onClick={handleSubmit}
                className='bg-custom-gradient'
            >
            {loading ? 'Loading...' : 'Update'}
            </Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
            <span className='cursor-pointer' onClick={()=> {setOpenModal(true)}}>
                Delete Account
            </span>
            <span onClick={handleLogout} className='cursor-pointer'>
                Logout
            </span>
        </div>
        <ModalBox openModal={openModal} setOpenModal={setOpenModal}>
            <DeleteUserForm setOpenModal={setOpenModal}/>
        </ModalBox>
        </div>
    );
}