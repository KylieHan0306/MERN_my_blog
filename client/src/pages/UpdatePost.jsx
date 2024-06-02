import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import CodeBox from '../components/CodeBox';
import axios from 'axios';

export default function UpdatePost() {
    const [photo, setPhoto] = useState(null);
    const { currUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        code: '',
        photoUrl: '',
        category: ''});
    const [updateError, setUpdateError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [codeError, setCodeError] = useState(null);
    const { postId } = useParams();
    const navigate = useNavigate();

    const fetchPost = async () => {
        try {
            if (!postId) navigate('/error', {state: {errorMessage: 'Unable to reach the server. Please ensure you are connected to the internet, or try again later.'}});
            const res = await axios.get(`/api/post?postId=${postId}`);
            if (res.status === 200) {
                setFormData(res.data.posts[0]);
            }
        } catch (e) {
            console.error(e);
            navigate('/error', {state: {errorMessage: 'Unable to reach the server. Please ensure you are connected to the internet, or try again later.'}});
        }
    }

    useEffect(() => {
        fetchPost();
    }, [postId])

    const handlePhotoUpload = async () => {
        if (photo) {
            try{
                setUploadError(null);
                const storage = getStorage(app);
                const photoName = currUser.email + new Date() + photo.name;
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
                    },
                    () => {
                        getDownloadURL(upload.snapshot.ref).then((url)=>{setFormData({...formData, photoUrl:url }); });
                    }
                )
            } catch (e) {
                setUploadError('An error occurred while uploading the image.');
            }
        } else {
            setUploadError('Please upload an image');
        }
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content) {
            setUpdateError('Your post must include content. Please add some text."');
            return;
        }
        try {
            const res = await axios.put(`/api/post/update/${currUser._id}/${postId}`, formData);
            if (res.status === 200) {
                navigate(`/post/${res.data.slug}`);
            }
        } catch (e) {
            const errorMessage = e.response.data.errMessage;
            if (errorMessage.indexOf('E11000') !== -1) {
                setUpdateError('Title already taken');
                return;
            }
            setUpdateError(errorMessage);
        }

    };

    const handleCodeChange = (e) => {
        if (formData.category === 'random-staff' || formData.category === 'uncategorized') return setCodeError('Please select a proper code type for this post.');
        setFormData({...formData, code: e.target.value})
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput
                type='text'
                placeholder='Title'
                required
                id='title'
                className='flex-1'
                onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                }
                value={formData.title}
            />
            <Select
                onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
                }
                value={formData.category}
            >
                <option value='uncategorized'>Uncategorized</option>
                <option value='random-staff'>Random staff</option>
                <option value='c'>C</option>
                <option value='javascript'>JavaScript</option>
                <option value='java'>Java</option>
                <option value='php'>Php</option>
                <option value='python'>Python</option>
                <option value='ruby'>Ruby</option>
                <option value='sass'>Sass</option>
                <option value='sql'>Sql</option>
                <option value='swift'>Swift</option>
                <option value='tsx'>Tsx</option>
            </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput
                type='file'
                accept='image/*'
                onChange={(e) => setPhoto(e.target.files[0])}
            />
            <Button
                type='button'
                gradientDuoTone='purpleToBlue'
                size='sm'
                outline
                onClick={handlePhotoUpload}
                disabled={uploadProgress}
            >
                {uploadProgress ? (
                <div className='w-16 h-16'>
                    <CircularProgressbar
                    value={uploadProgress}
                    text={`${uploadProgress || 0}%`}
                    />
                </div>
                ) : (
                    'Upload Image'
                )}
            </Button>
            </div>
            {uploadError && <Alert color='failure'>{uploadError}</Alert>}
            {formData.photoUrl && (
            <img
                src={formData.photoUrl}
                alt='upload'
                className='w-full h-72 object-cover'
            />
            )}
            <TextInput
                type='text'
                placeholder='Write some code'
                id='code'
                className='flex-1'
                onChange={handleCodeChange}
                value={formData.code}
            />
            {codeError && <Alert className='mt-5' color='failure'> {codeError}</Alert>}
            {formData.code && <CodeBox language ={formData.category} code={formData.code}/>}
            <ReactQuill
                theme='snow'
                placeholder='Write something...'
                className='h-72 mb-12'
                onChange={(value) => {
                    setFormData({ ...formData, content: value });
                }}
                value={formData.content}
                required
            />
            <Button 
                outline
                type='submit'                 
                style={{
                    backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
                }}
            >
                Update
            </Button>
            {updateError && (
            <Alert className='mt-5' color='failure'>
                {updateError}
            </Alert>
            )}
        </form>
        </div>
    );
}