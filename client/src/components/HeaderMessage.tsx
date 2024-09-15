'use client'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '@/interfaces'
import ModalNewMessage from './ModalNewMessage'

export default function HeaderMessage() {
    const modal=useSelector((state:State)=>state.modal);
    
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
