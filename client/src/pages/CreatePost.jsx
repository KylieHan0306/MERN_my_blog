import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import CodeBox from '../components/CodeBox';
import axios from 'axios';

export default function CreatePost() {
  const [photo, setPhoto] = useState(null);
  const { currUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({category: 'javascript', owner: currUser?.username});
  const [publishError, setPublishError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [codeError, setCodeError] = useState(null);

  const navigate = useNavigate();

  const handlePhotoUpload = async () => {
    if (photo) {
      try{
        setUploadError(null);
        setPhotoUrl(URL.createObjectURL(photo));
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
                setPhotoUrl(null);
            },
            () => {
                getDownloadURL(upload.snapshot.ref).then((url)=>{ setPhotoUrl(url); setFormData({...formData, image:url }); });
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
      setPublishError('Your post must include content. Please add some text."');
      return;
    }
    try {
      const res = await axios.post('/api/post/create', formData);
      if (res.status === 201) {
        navigate(`/post/${res.data.slug}`);
      }
    } catch (e) {
      const errorMessage = e.response.data.errMessage;
      if (errorMessage.indexOf('E11000') !== -1) {
        setPublishError('Title already taken');
        return;
      }
      setPublishError(errorMessage);
    }

  };

  const handleCodeChange = (e) => {
    if (formData.category === 'random-staff' || formData.category === 'uncategorized') return setCodeError('Please select a proper code type for this post.');
    setFormData({...formData, code: e.target.value})
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
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
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            defaultValue={'javascript'}
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
        {formData.image && (
          <img
            src={formData.image}
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
          required
        />
        <Button 
          outline
          type='submit'                 
          style={{
            backgroundImage: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
          }}
        >
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}