'use client'
import { useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import '@/styles/loading.css'
import { Post, State } from '@/interfaces';
import Link from 'next/link';
import { activeModalAllComment, activeModalAvatar, activeModalPost } from '@/store/reducers/ModalReducer';
import { getUsers } from '@/services/users.service';
import { getPosts } from '@/services/posts.service';
import { setPost } from '@/store/reducers/PostReducer';
import HeaderLeft from '@/layouts/HeaderLeft';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
export default function page() {
    //Initialize
    const dispatch=useDispatch();
    const userOnline=useSelector((state:State)=>state.user);
    const users=useSelector((state:State)=>state.users);
    const posts=useSelector((state:State)=>state.posts);
    const loading=useSelector((state:State)=>state.loading);
    const [postsByUserOnline,setPostsByUserOnline]=useState<Post[]>([]);
    const [viewFollowers,setViewFollowers]=useState<boolean>(false);
    const [viewUserFollow,setViewUserFollow]=useState<boolean>(false);
    const router=useRouter();
    //get data
    useEffect(()=>{
      dispatch(getUsers());
      dispatch(getPosts());
    },[])
    //get posts of UserOnline
    useEffect(()=>{
      if(userOnline){
        const newPosts:Post[]=posts.filter(post=>post.idUser==userOnline.id&&!post.lock);
        setPostsByUserOnline(newPosts);
      }   
    },[posts,userOnline])
    //open modal Avatar
    const openModalAvatar=()=>{
      console.log(1);
      
      dispatch(activeModalAvatar({type:'personal',status:true}));
    }
    //view followers of UserOnline
    const viewFollowersOfUser=()=>{
      setViewFollowers(!viewFollowers);
    }
    //view User Followed of UserOnline
    const viewUserFollowByUserOnline=()=>{
      setViewUserFollow(!viewUserFollow);
    }
    //open modal post
    const openModalPost=(post:Post)=>{
      dispatch(setPost(post));
      dispatch(activeModalAllComment());
      router.push(`/home?id=${post.id}`)
    }
  return (
    <>
    <><title>Personal</title>   </>
    <HeaderLeft/>
    <div className='p-[50px] ml-[230px]'>
        <header className='px-[40px] flex gap-[80px] items-center relative'>       
        {loading&&<div className="lds-ellipsis absolute top-[-30px] right-[-120px]"><div></div><div></div><div></div><div></div></div>}
        {userOnline?.avatar && (
            <div onClick={openModalAvatar}><img
            
            className="cursor-pointer w-[150px] h-[150px] rounded-[50%] z-[-1] object-cover"
            src={userOnline.avatar}
            alt="User Avatar"
            width={150}
            height={150}
            style={{ borderRadius: '50%' }} 
          /></div>
            )}
            <div className='flex flex-col gap-[30px]'>
                <div className='flex gap-[20px] items-center'>
                    <div className='text-[20px]'>{userOnline?.username}</div>
                  <Link href={'edit'}> <Button className='opacity-40 text-[14px]' variant="dark">Chỉnh sửa trang cá nhân</Button></Link> 
                    <Button className='opacity-40 text-[14px]' variant="dark">Xem kho lưu trữ</Button>
                </div>
                <div className='flex gap-[40px]'>
                    <div className='p-[10px]'><span className='font-bold'>{postsByUserOnline.length}</span> bài viết</div>
                    <div className='cursor-pointer hover:bg-[rgb(221,210,156)] p-[10px] rounded-[5px]' onClick={viewFollowersOfUser}><span className='font-bold'>{users.filter(user=>user.followUsersById.includes(userOnline?.id)).length}</span> người theo dõi</div> 
                    {viewFollowers&&
                    <div className='absolute flex flex-col gap-[10px] bg-gray-200 rounded-[10px] shadow-sm p-[10px] right-[430px] top-[130px]'>
                      {users.filter(user=>user.followUsersById.includes(userOnline?.id)).map(item=>(
                        <div className='flex gap-[5px] items-center'>
                            <img className='w-[20px] h-[20px] rounded-[50%]' src={item.avatar} alt="" />
                            <div>{item.username}</div>
                        </div>
                      ))}
                    </div> }
                    <div onClick={viewUserFollowByUserOnline} className='cursor-pointer hover:bg-[rgb(221,210,156)] p-[10px] rounded-[5px]'>Đang theo dõi <span className='font-bold'>{userOnline?.followUsersById.length}</span> người dùng</div>  
                     {viewUserFollow&&
                    <div className='absolute flex flex-col gap-[10px] bg-gray-200 rounded-[10px] shadow-sm p-[10px] right-[200px] top-[130px]'>
                      {userOnline?.followUsersById.map(item=>(
                        <div className='flex gap-[5px] items-center px-[50px]'>
                            <img className='w-[20px] h-[20px] rounded-[50%]' src={users.find(user=>user.id==item)?.avatar} alt="" />
                            <div>{users.find(user=>user.id==item)?.username}</div>
                        </div>
                      ))}
                    </div> }            
                </div>
            </div>
        </header>
        {/* Header end */}
        <div className='mt-[40px] ml-[20px] mb-[40px]'>
            <i className='bx bx-plus bx-border-circle text-[55px] bg-[rgb(250,250,250)] text-[rgb(199,199,199)] border-1'></i>
            <p className='text-[14px] ml-[25px] font-bold'>Mới</p>
        </div>
        <div className='w-[100%]' style={{border:"1px solid rgb(239,239,239)"}}></div>
        <div className='my-[20px] flex justify-center gap-[50px]'>
            <div className='flex items-center gap-[10px]  text-black cursor-pointer'>
            <i className='bx bx-menu bx-border'></i>
            <div className='uppercase'>Bài viết</div>
            </div>
            <div className='flex items-center gap-[10px] text-gray-500 cursor-pointer'>
            <i className='bx bx-home-alt-2'></i>
            <div className='uppercase'>Đã lưu</div>
            </div>
            <div className='flex items-center gap-[10px] text-gray-500 cursor-pointer'>
            <i className='bx bx-user bx-border' ></i>
            <div className='uppercase'>Được gắn thẻ</div>
            </div>
        </div>
      {/* Post start */}
       <div className='grid grid-cols-3 gap-[5px]'>
         {postsByUserOnline.sort((a,b)=>b.date-a.date).map((post:Post)=>(
            <img key={post.id} onClick={()=>openModalPost(post)} className='h-[300px] w-[300px] hover:opacity-85 cursor-pointer' src={post.images[0]} alt="" />
        ))}        
       </div>
      {/* Post end */}
    </div>
    </>
  )
}
