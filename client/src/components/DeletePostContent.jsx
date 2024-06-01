import React from 'react';
import { Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DeletePostContent({setOpenModal, handleDeletePost}) {
  return (
    <div className='text-center'>
        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeletePost}>
                    Yes, I'm sure
                </Button>
                <Button color='gray' onClick={(e) => {e.preventDefault(); setOpenModal(false);}}>
                    No, cancel
                </Button>
            </div>
    </div>
  )
}
