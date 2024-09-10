import { Post, State} from '@/interfaces';
import type { User } from '@/interfaces';
import { getPosts } from '@/services/posts.service';
import { getUsers } from '@/services/users.service';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
type ParamsProp={
    params:{
        id:string;
    }
}
export default function page({params}:ParamsProp) {
    const id=params.id;
    const dispatch=useDispatch();
    const router=useRouter();
    const userOnline=useSelector((state:State)=>state.user);
    const users=useSelector((state:State)=>state.users);
    const posts=useSelector((state:State)=>state.posts);
    const [user,setUser]=useState<User>({
      id:'',
      username:'',
      password:'',
      email:'',
      avatar:'',
      biography:'',
      gender:'',
      followUsersById:[],
      status:true,
      private:false,
      requestFollowById:[]
    });
    const [postsByUser,setPostsByUser]=useState<Post[]>([]);
    //get data
    useEffect(()=>{
        dispatch(getUsers());
        dispatch(getPosts());
    },[])
    //get posts of User
    useEffect(()=>{
        //get list posts include posts of user which have status different 'Only you'
       const newPosts=posts.filter(post=>post.id===id&&post.status!=='Chỉ mình tôi');
       //case user is private
       if(user.private){
        //if userOnline is follower of user
        if(userOnline.followUsersById.includes(user.id)){
            setPostsByUser(newPosts);
        }else{
            // only get posts of user which have status 'Public'
            const postsFinally = newPosts.filter(btn=>btn.status=='Công khai');
            setPostsByUser(postsFinally);
        }
       }else{
          setPostsByUser(newPosts);
       }
      
    },[posts,user])
    //get detail user 
    useEffect(()=>{
        const newUser=users.find(user=>user.id==id);
        if(newUser)setUser(newUser);
    },[users])
  //return Status fOLLOW
  const returnStatusFollow=()=>{
     if(userOnline.followUsersById.includes(user.id)){
        return 'Đang theo dõi'
     }
     if(user.requestFollowById.includes(userOnline.id)){
        return 'Đã gửi yêu cầu theo dõi'
     }
     return 'Chưa theo dõi'
  }
  //open Modal Post
  const openModalPost=(idPost:string)=>{
    
  }
  //handleFollow
  const handleFollow=()=>{
    
   
  }
  return (
    <div className='p-[50px] ml-[230px]'>
      
        <header className='px-[40px] flex gap-[80px] items-center'>
            <img className='cursor-pointer w-[150px] h-[150px] rounded-[50%]' src={user.avatar} alt="" />
            <div className='flex flex-col gap-[30px]'>
                <div className='flex gap-[20px] items-center'>
                    <div className='text-[20px]'>{user.username}</div>
                    <div onClick={handleFollow} className='bg-[rgb(239,239,239)] cursor-pointer rounded-[5px] text-orange-500 px-[10px] py-[5px]'>{returnStatusFollow()}</div>
                </div>
                <div className='flex gap-[40px]'>
                    <div><span className='font-bold'>{postsByUser.length}</span> bài viết</div>
                    <div><span className='font-bold'>{users.filter(btn=>btn.followUsersById.includes(user.id)).length}</span> người theo dõi</div> 
                    <div>Đang theo dõi <span className='font-bold'>{user.followUsersById.length}</span> người dùng</div>              
                </div>
            </div>
        </header>
        {/* Header end */}
        <div className='mt-[40px] ml-[20px] mb-[40px]'>
            <i className='bx bx-plus bx-border-circle text-[55px] bg-[rgb(250,250,250)] text-[rgb(199,199,199)] border-1'></i>
            <p className='text-[14px] ml-[25px] font-bold'>Mới</p>
        </div>
        <hr className='' />
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
      {user.private&&!userOnline.followUsersById.includes(user.id)&&
         <div className='flex flex-col items-center justify-center gap-[20px]'>
              <p className='font-bold text-[16px]'>Người dùng đã cài đặt  riêng tư</p>
              <p className='text-orange-500'>Bạn có muốn theo dõi tài khoản này để xem thêm bài viết?</p>
         </div> 
       }
        <div className='grid grid-cols-3 gap-[5px]'>
        {postsByUser.sort((a,b)=>b.date-a.date).map((post:Post)=>(
           <img key={post.id} onClick={()=>openModalPost(post.id)} className='h-[300px] w-[300px] hover:opacity-85 cursor-pointer' src={post.images[0]} alt="" />
       ))}        
        </div>
       
      {/* Post end */}
    </div>
  )
}
