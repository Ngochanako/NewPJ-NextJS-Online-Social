'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '@/interfaces'
import ModalNewMessage from './ModalNewMessage'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { logoutUser, setUserLogin } from '@/store/reducers/UserReducer'

export default function HeaderMessage() {
    const modal=useSelector((state:State)=>state.modal);
    const userOnline=useSelector((state:State)=>state.user);
    const users=useSelector((state:State)=>state.users);
    const router=useRouter();
    const dispatch=useDispatch();
     //if  UserOnline is locked
  useEffect(()=>{
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if(savedUser){
      axios.get(`http://localhost:3000/users/${savedUser.id}`)
      .then(res=>{       
        if(!res.data.status){
          router.push('/login');
          localStorage.removeItem('user');
          dispatch(logoutUser());
        }else{
          dispatch(setUserLogin(res.data));
        }
      })
    }else{
      router.push('/login');
    }   
  },[users])
  return (
    <div className=' bg-gray-900 text-white'>
       <header className='p-[20px]  h-[100%]  flex flex-col justify-around'>
        <div className=''>
          <i className="fa-brands fa-instagram text-[20px]"></i>
        </div>
        <Link  href={'/home'}>
          <i className="fa-solid fa-house text-[#565555] text-[22px] hover:text-white"></i>
        </Link>
        <div>
          <i className="fa-solid fa-magnifying-glass text-[#565555] text-[22px]"></i>
        </div>
        <div>
         <i className="fa-solid fa-user-plus text-[#565555] text-[22px]"></i>          
        </div>
        <div>      
          <i className="fa-solid fa-user-group text-[#565555] text-[22px]"></i>      
        </div>
        <Link href={'/message'}>
        <i className="fa-brands fa-facebook-messenger text-[#565555] text-[22px] hover:text-white"></i>
        </Link>
        <div>
        <i className="fa-solid fa-heart text-[#565555] text-[22px]"></i>
        </div>
        <div>
        <i className="fa-solid fa-plus text-[#565555] text-[22px]"></i>
        </div>
        <Link href={'/personal'}>
        <i className="fa-solid fa-user text-[#565555] text-[22px]"></i>
        </Link>
      </header>
    </div>
  )
}
