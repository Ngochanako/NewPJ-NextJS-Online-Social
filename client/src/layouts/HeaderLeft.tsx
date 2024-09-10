'use client'
import { State, User } from '@/interfaces';
import { getUsers, updateUser } from '@/services/users.service';
import { activeModalPost } from '@/store/reducers/ModalReducer';
import { logoutUser, setUserLogin } from '@/store/reducers/UserReducer';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import style from '@/styles/headerLeft.module.css'
import { ModalDialog } from 'react-bootstrap';
import ModalCreatePost from '@/components/ModalCreatePost';
import ModalUploadPost from '@/components/ModalUploadPost';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ModalAvatar from '@/components/ModalAvatar';
import ModalAllComment from '@/components/ModalAllComment';
import ModalDelete from '@/components/ModalDelete';
import ModalEditPost from '@/components/ModalEditPost';
import ModalDetailUser from '@/components/ModalDetailUser';
export default function HeaderLeft() {
  //Initiliaze
  const dispatch=useDispatch();
  const [search,setSearch]=useState<boolean>(false);
  const [usersSearch,setUsersSearch]=useState<User[]>([]);
  const [valueSearch,setValueSearch]=useState<string>('');
  const [requestFollow,setRequestFollow]=useState<boolean>(false);
  const [usersRequestFollow,setUsersRequestFollow]=useState<User[]>([]);
  const [viewMore, setViewMore]=useState<boolean>(false);
  const users=useSelector((state:State)=>state.users);
  const userOnline=useSelector((state:State)=>state.user);
  const modal=useSelector((state:State)=>state.modal);
  const router=useRouter();

  //get data
  useEffect(()=>{
     dispatch(getUsers())
  },[])
  //search User
  const openSearch=()=>{
      setSearch(!search);
  }
  const closeSearch=()=>{
     setSearch(false);
  }
  const handleSearch=(e:React.ChangeEvent<HTMLInputElement>)=>{
     const {value}=e.target;
     setValueSearch(value);
     let newUsersSearch=users.filter(user=>user.username.includes(value));
     setUsersSearch(newUsersSearch);
  }
  // request Follow
  const openRequestFollow=()=>{
     setRequestFollow(!requestFollow);
  }
  const closeRequestFollow=()=>{
    setRequestFollow(false);
  }
  // get list users request follow
  useEffect(()=>{
     const listRequestFollow=users.filter((user:User)=>userOnline?.requestFollowById.includes(user.id));
     setUsersRequestFollow(listRequestFollow);
  },[users,userOnline])
  //accept request follow
  const confirmRequestFollow=(user:User)=>{
    const newUserOnline:User={
      ...userOnline,
      requestFollowById:userOnline.requestFollowById.filter(btn=>btn!==user.id)
    }
    const newUserUpdateFollow:User={
      ...user,
      followUsersById:[...user.followUsersById,userOnline.id]
    }
    dispatch(updateUser(newUserUpdateFollow));
    dispatch(updateUser(newUserOnline));
    dispatch(setUserLogin(newUserOnline));
    localStorage.setItem('user',JSON.stringify(newUserOnline));
  }
  const cancelRequestFollow=(user:User)=>{
    const newUser={
      ...userOnline,
      requestFollowById:userOnline.requestFollowById.filter(btn=>btn!==user.id)
    }
    dispatch(updateUser(newUser));
    dispatch(setUserLogin(newUser));
    localStorage.setItem('user',JSON.stringify(newUser));
  }
  //view more
  const handleClickViewMore=()=>{
    setViewMore(!viewMore);
  }
  //open modal Post
   const openModalPost=()=>{
     dispatch(activeModalPost({type:'personal',status:true}))
   }
   //logout
   const logout=()=>{
    dispatch(logoutUser());
    localStorage.removeItem('user');
    router.push('/login');
   }
  return (
    <div>
      {modal.post.status&&<ModalCreatePost/>}
      {modal.uploadPost.status&&<ModalUploadPost/>}
      {modal.avatar.status&&<ModalAvatar/>}
      {modal.comments&&<ModalAllComment/>}
      {modal.delete&&<ModalDelete/>}
      {modal.editPost&&<ModalEditPost/>}
      <header className={`${style.headerLeft}  p-[30px] fixed`}>
        <div className={`${style.headerListItem} mb-[30px]`}>
          <i className="fa-brands fa-instagram text-[20px]"></i>
          <div className='text-[20px] font-[600]'>INSTAGRAM</div>
        </div>
        <div className='flex flex-col gap-[10px] text-[15px]'>
        <Link  href={'/home'} className={style.headerListItem}>
          <i className="fa-solid fa-house text-[#565555] text-[22px]"></i>
          <div>Trang chủ</div>
        </Link>
        <div  className={style.headerListItem}>
          <i className="fa-solid fa-magnifying-glass text-[#565555] text-[22px]"></i>
          <div onClick={openSearch}  className=''>Tìm kiếm</div>
          {search&&
          <div className="absolute z-1000 top-0 left-20 w-[400px] h-[99%]  bg-white flex flex-col gap-[50px] rounded-r-[10px] shadow-lg z-[10]">
            <i onClick={closeSearch} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-gray-600 top-[20px] right-[20px] absolute"></i>
              <div className="text-[20px] font-bold px-[50px] pt-[50px]">Tìm kiếm</div>
              <input onChange={handleSearch} type="text" className="mx-[50px] bg-[rgb(239,239,239)] p-[10px] text-[14px]" placeholder="Tìm kiếm người dùng" />
              <hr className=""/>
              <div className="flex flex-col gap-[20px] px-[50px]">
                  {usersSearch.map(btn=>(
                      <div className='flex items-center gap-[10px]'>
                      <img className='w-[50px] h-[50px] rounded-[50%]' src={btn.avatar} alt="" />
                       <div>
                       <Link href={`/user/${btn.id}`}><div className=''>{btn.username}</div></Link>
                       {/* <p className="text-gray-500 text-[14px]">{btn.followersById.length} người theo dõi</p> */}
                       </div>
                  </div>
                  ))}
                  
              </div>
              
          </div>}
        </div>
        <div className={style.headerListItem}>
         <i className="fa-solid fa-user-plus text-[#565555] text-[22px]"></i>
          <div onClick={openRequestFollow} className=''>Theo dõi</div>
          {userOnline?.requestFollowById.length>0&&<div className="w-[20px] h-[20px] rounded-[50%] bg-red-500 text-white flex justify-center items-center absolute right-[190px] top-[220px]">{userOnline.requestFollowById.length}</div>}
          <div></div>
          {requestFollow&&
          <div className="absolute z-[1000] top-0 left-20 w-[400px] h-[99%]  bg-white flex flex-col gap-[50px] rounded-r-[10px] shadow-lg">
            <i onClick={closeRequestFollow} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-gray-600 top-[20px] right-[20px] absolute"></i>
              <div className="text-[20px] font-bold px-[50px] pt-[50px]">Yêu cầu theo dõi</div>
              <hr className=""/>
              <div className="flex flex-col gap-[20px] px-[50px]">
                  {usersRequestFollow.map(btn=>(
                      <div key={btn.id} className="flex items-center justify-center gap-[10px]">
                          <Link href={`/user/${btn.id}`}><img className="w-[50px] h-[50px] rounded-[50%]" src={btn.avatar} alt="" /></Link>
                          <div>
                            <Link href={`/user/${btn.id}`}><div className="font-bold">{btn.username}</div></Link>
                            <div className="flex gap-[20px]">
                            <Button onClick={()=>confirmRequestFollow(btn)} variant="primary">Xác nhận</Button>
                            <Button onClick={()=>cancelRequestFollow(btn)} variant="secondary">Xóa</Button>
                            </div>
                          </div>
                      </div>
                      
                  ))}              
              </div>             
          </div>}
        </div>
        <Link  href={'/group'} className={style.headerListItem}>
       
          <i className="fa-solid fa-user-group text-[#565555] text-[22px]"></i>
          <div className=''>Nhóm</div>
       
        </Link>
        <div className={style.headerListItem}>
        <i className="fa-brands fa-facebook-messenger text-[#565555] text-[22px]"></i>
          <div className=''>Tin nhắn</div>
        </div>
        <div className={style.headerListItem}>
        <i className="fa-solid fa-heart text-[#565555] text-[22px]"></i>
          <div className=''>Thông báo</div>
        </div>
        <div className={style.headerListItem}>
        <i className="fa-solid fa-plus text-[#565555] text-[22px]"></i>
          <div onClick={openModalPost} className='cursor-pointer'>Tạo</div>
        </div>
        <Link href={'/personal'} className={style.headerListItem}>
        <i className="fa-solid fa-user text-[#565555] text-[22px]"></i>
          <div>Trang cá nhân</div>
        </Link>
        <div onClick={handleClickViewMore} className={style.headerListItem}>
        <i className="fa-solid fa-bars text-[#565555] text-[22px] relative"></i>
          <div  className=''>Xem thêm</div>
          {/* section View More */}
          {viewMore &&  <div className='flex flex-col p-[10px] bg-white absolute top-[350px] right-[20px] z-[1000] shadow-2xl rounded-lg'>
              <div className={`${style.viewmoreItem} flex gap-[20px]`}>
                <i className="fa-solid fa-gear"></i>
                <Link  href={'/edit'}> Chỉnh sửa trang cá nhân</Link>
              </div>
              <div className={`${style.viewmoreItem} flex gap-[20px]`}>
                <i className="fa-solid fa-chart-line"></i>
                <div>Hoạt động của bạn</div>
              </div>
              <div  className={`${style.viewmoreItem} flex gap-[20px]`}>
              <i className="fa-solid fa-right-from-bracket"></i>
                <div onClick={logout}>Đăng xuất</div>
              </div>
          </div>}
        </div>
        </div>
      </header>
    </div>
  )
}

