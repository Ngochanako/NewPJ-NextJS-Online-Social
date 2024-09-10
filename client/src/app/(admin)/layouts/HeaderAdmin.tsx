import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import styleAdmin from '@/styles/admin.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { usePathname, useRouter } from 'next/navigation';
export default function HeaderAdmin() {
    const [widthHeaderLeft,setWithHeaderLeft]=useState<string>('200px');
    const [hiddenHeader,setHiddenHeader]=useState<boolean>(true);
    const [select,setSelect]=useState<string>('users');
    const router=useRouter();
    const pathName=usePathname();
    useEffect(()=>{
       if(pathName=='/admin/posts'){
        setSelect('posts');
       }
    },[])
    //handle Mouse header-left
    const handleMouseHeaderLeft=()=>{
        setWithHeaderLeft(widthHeaderLeft=='80px'?'200px':'80px');
        setHiddenHeader(hiddenHeader?false:true);
    } 
    const handleCLickUsers=()=>{
        router.push('/admin');
    }
    const handleClickPosts=()=>{
        router.push('/admin/posts');
    }
  return (
    <>
    <header onMouseEnter={handleMouseHeaderLeft} className={` flex flex-col w-[${widthHeaderLeft}] py-[20px] bg-[rgb(17,24,39)] text-[rgb(156,163,175)] gap-[20px]  rounded-r-[5px] transition-all duration-[500ms] min-h-[600px]`}>
        <i onClick={handleMouseHeaderLeft} className='bx bx-menu text-[30px] ml-[20px]  cursor-pointer hover:text-[rgb(31,41,55)]'></i>
        
        <div onClick={handleCLickUsers} className={`${select=='users'?styleAdmin.activeHeader:''} p-[10px] ml-[20px] flex items-center gap-[10px] cursor-pointer`} >
           <FontAwesomeIcon icon={faUser}/>              
            {hiddenHeader&&<div>Users</div>}
        </div>
        <div onClick={handleClickPosts} className={`${select=='posts'?styleAdmin.activeHeader:''} p-[10px] ml-[20px] flex items-center gap-[10px] cursor-pointer`} >
                <i className='bx bxs-book'></i>
                {hiddenHeader&&<div>Posts</div>}
        </div>
    </header>
    </>
  )
}
