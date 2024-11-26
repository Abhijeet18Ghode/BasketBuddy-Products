"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
const Page = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { data: session } = useSession();
    const router = useRouter();

  

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (res.error) {
                toast.error("Invalid Credentials");
            } else {
                toast.success("Login Successful");
                router.replace("/e-cart");
            }
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    useEffect(() => {
        if (session && session.user) {
            router.replace("/");
        }
    }, [session, router]);

    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <Toaster />
            <div className='flex flex-col items-center justify-between w-1/2 h-3/4 shadow-2xl rounded-md p-5'>
                <img src='/logo.png' className='w-32 h-32 rounded-full' alt="Logo" />
                <div className='flex flex-col items-center w-full gap-10'>
                    <div className='w-full flex flex-col items-center gap-2'>
                        <h1>Login</h1>
                        <hr className='w-1/4' />
                    </div>
                    <form method='POST' onSubmit={handleLogin} className='flex flex-col w-4/5 h-full items-center gap-5'>
                        <div className='flex flex-col items-center gap-2 w-full justify-center'>
                            <input 
                                type='email' 
                                onChange={handleChange} 
                                name='email' 
                                placeholder='Enter Email ID' 
                                className='border-x-2 border-y-2 border-slate-200 p-2 rounded-md w-full outline-none' 
                                required
                            />
                            <input 
                                type='password' 
                                onChange={handleChange} 
                                name='password' 
                                placeholder='Enter Password' 
                                className='border-x-2 border-y-2 border-slate-200 p-2 rounded-md w-full outline-none' 
                                required
                            />
                        </div>
                        <input 
                            type='submit' 
                            value="Login" 
                            className='w-full text-sm text-white p-2 bg-black rounded-md' 
                        />
                         <button 
                             type='button' 
                             onClick={() => signIn('google')} 
                             className='w-full flex items-center justify-center gap-2 text-sm p-2 border rounded-md'
                         >
                             <FcGoogle /> Sign in with Google
                         </button>
                    </form>
                </div>
                <h1 className='flex items-center gap-1'>
                    Dont have an account? <Link href="/user">SignUp</Link>
                </h1>
            </div>
        </div>
    );
};

export default Page;
