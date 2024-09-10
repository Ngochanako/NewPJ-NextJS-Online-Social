import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

export default function NavAdmin() {
    const router=useRouter();
    // authorize access to page
    useEffect(()=>{
      const admin=JSON.parse(localStorage.getItem('admin')||'null');
      if(!admin){
        router.push('/login');
      }
    },[])
    //log out
    const logout=()=>{
       localStorage.removeItem('admin');
       router.push('/login');
    }
  return (
    <div>
      <nav className={`flex justify-between w-[100%] bg-[rgb(17,24,39)] text-[rgb(156,163,175)] py-2  px-[50px] font-bold`}>
          <ul className='flex gap-3'>
            <li className='flex gap-1 items-center p-[5px]'>
            <i className='bx bxs-home-alt-2'></i>
            <div>Home</div>
            </li>
          </ul>
          <ul className='flex items-center gap-[20px]'>
            <li className='bg-white rounded-xl p-1 text-black'>Admin</li>
            <li onClick={logout}><i className="fa-solid fa-right-from-bracket cursor-pointer"></i></li>
          </ul>
        </nav>
    </div>
  )
}
