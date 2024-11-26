"use client";
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    Cpassword: '',
    contact: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'password' || e.target.name === 'Cpassword') {
      setPasswordError('');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Ensure password and confirm password match
      if (formData.password !== formData.Cpassword) {
        setPasswordError('Passwords do not match');
        return;
      }

      const contactInt = parseInt(formData.contact);
      const res = await axios.post('/api/signup', {
        ...formData,
        contact: contactInt,
      });

      if (res.status === 201) {
        toast.success('Signup successful!');
        // You can redirect the user after successful signup if needed
        // router.push('/login');
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response && error.response.data && error.response.data.error) {
        // Display specific error message from server
        toast.error(error.response.data.error);
      } else {
        // Display generic error message
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Toaster />
      <div className='flex flex-col items-center justify-between w-1/2 h-3/4 shadow-2xl rounded-md p-5'>
        <img src='/logo.png' className='w-32 h-32 rounded-full' alt='Logo' />
        <div className='flex flex-col items-center w-full gap-10'>
          <div className='w-full flex flex-col items-center gap-2'>
            <h1>SignUp</h1>
            <hr className='w-1/4' />
          </div>

          <form method='POST' onSubmit={handleSignUp} className='flex flex-col w-4/5 h-full items-center gap-5'>
            <div className='flex items-center justify-center gap-2 w-full'>
              <input
                type='text'
                onChange={handleChange}
                name='name'
                placeholder='Enter Name'
                className='border-x-2 border-y-2 border-slate-200 p-2 rounded-md w-full outline-none'
                required
              />
            </div>

            <div className='flex items-center gap-2 w-full justify-center'>
              <input
                type='password'
                onChange={handleChange}
                name='password'
                placeholder='Enter Password'
                className='border-x-2 border-y-2 border-slate-200 p-2 rounded-md w-1/2 outline-none'
                required
              />
              <input
                type='password'
                onChange={handleChange}
                name='Cpassword'
                placeholder='Confirm Password'
                className='border-x-2 border-y-2 border-slate-200 p-2 rounded-md w-1/2 outline-none'
                required
              />
            </div>

            <div className='flex items-center gap-2 w-full justify-center'>
              <input
                type='email'
                onChange={handleChange}
                name='email'
                placeholder='Enter Email ID'
                className='border-x-2 border-y-2 border-slate-200 p-2 rounded-md w-full outline-none'
                required
              />
            </div>

            <div className='flex items-center gap-2 w-full justify-center'>
              <input
                type='number'
                onChange={handleChange}
                name='contact'
                placeholder='Enter Contact Number'
                className='border-x-2 border-y-2 border-slate-200 p-2 rounded-md w-full outline-none'
                required
              />
            </div>

            {passwordError && <p className="text-red-500">{passwordError}</p>}

            <input
              type='submit'
              value='Create Account'
              className='w-full text-sm text-white p-2 bg-black rounded-md cursor-pointer'
            />
          </form>
        </div>
        <h1 className='flex items-center gap-1'>
          Already have an account? <Link href='/user/login'>Login</Link>
        </h1>
      </div>
    </div>
  );
};

export default Page;
