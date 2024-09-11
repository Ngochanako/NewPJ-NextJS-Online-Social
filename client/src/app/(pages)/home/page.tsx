'use client'
import { Post, State, User } from '@/interfaces'
import { convertTime } from '@/interfaces/convertTime';
import HeaderLeft from '@/layouts/HeaderLeft'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Carousel from 'react-bootstrap/Carousel';
import { getPosts, updatePost } from '@/services/posts.service';
import { activeModalAllComment } from '@/store/reducers/ModalReducer';
import { setPost } from '@/store/reducers/PostReducer';
import { getUsers, updateUser } from '@/services/users.service';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function page() {
    //Initialize
    const dispatch=useDispatch();
    const postsLocal=useSelector((state:State)=>state.posts);
    const users=useSelector((state:State)=>state.users);
    const userOnline=useSelector((state:State)=>state.user);
    const commentsChild=useSelector((state:State)=>state.commentsChild);
    const [usersUnFolow,setUsersUnfolow]=useState<User[]>([]);
    const [posts,setPosts]=useState<Post[]>([]);
    const router=useRouter();
    //get data from API
    useEffect(()=>{
      dispatch(getUsers());
      dispatch(getPosts());
    },[])
    //get Users unfollow
    useEffect(()=>{
      //get users unflollow and user requested follow
      if(userOnline){
        const newUsers=users.filter(user=>!userOnline?.followUsersById.includes(user.id)&&user.id!==userOnline?.id);
        //get users unfollow
        const newUsersUnFollow=newUsers.filter(user=>!user.requestFollowById?.includes(userOnline?.id));
        //set users unfollow to state
        setUsersUnfolow(newUsersUnFollow);
      }
      
    },[users])
    //get posts from postsLocal
     useEffect(()=>{
        // retrieve posts 
        let newPosts=[];
        for(let post of postsLocal){
          if(post.lock) continue;
          if(post.idUser===userOnline.id){
            newPosts.push(post);
          }else{
            if(post.status=='Công khai'){
              newPosts.push(post);
            }
            if(post.status=='Riêng tư'&&userOnline.followUsersById.includes(post.idUser)){
              newPosts.push(post);
            }
          }        
        }
        setPosts(newPosts);
     },[postsLocal])
    //follow user
    const followUser=(user:User)=>{
        
        const newUser={
          ...user,
          requestFollowById:[...user.requestFollowById,userOnline.id]
        }
        dispatch(updateUser(newUser));
    }
    //return status follow
    const returnStatusFollow=(id:string)=>{
        let userOfPost=users.find(btn=>btn.id==id);
        if(userOfPost){
           if(userOfPost.id===userOnline?.id){
             return '';
           }
           if(userOfPost.requestFollowById.includes(userOnline?.id)){
             return 'Đã gửi yêu cầu theo dõi'
           }
           if(userOnline?.followUsersById.includes(id)){
             return 'Đã theo dõi'
           }
           return "Chưa theo dõi"
        }
     }
     //like post
     const likePost=(post:Post)=>{
          if(post.favouristUsersById.includes(userOnline.id)){
            const newPost={
                ...post,
                favouristUsersById:post.favouristUsersById.filter(btn=>btn!=userOnline.id)
            }
            dispatch(updatePost(newPost));
          }else{
          const newPost={
             ...post,
              favouristUsersById:[...post.favouristUsersById,userOnline.id]
          };
          dispatch(updatePost(newPost));
          }
     }
     //open modal View Comments
     const viewComments=(post:Post)=>{
        dispatch(activeModalAllComment());
        dispatch(setPost(post));
        router.push(`/home?id=${post.id}`);
     }
     //calculate total commments
     const totalComments=(commentsById:string[])=>{
        let total=commentsById.length;
        for(let commentId of commentsById){
            total+=commentsChild.filter(btn=>btn.idParent==commentId).length;
        }
        return total;
     }
  return (
    <div>
       <>
        <title>Home</title>
      </>
      <HeaderLeft/>
      <div className=' flex  ml-[230px]'>
      {/* Post start */}
      <main className='px-[100px] py-[50px] w-[70%] '>
      {/* <div className='w-[100%] ' style={{border:"1px solid rgb(239,239,239)"}}></div> */}
          <div className='flex flex-col gap-[20px] '>
           
            {posts.sort((a,b)=>b.date-a.date).map(btn=>(
              <div key={btn.id} className='border-1 border-gray-200 rounded-[10px] p-[20px] shadow-lg'>
                  {/* Title start */}
                <div className='flex justify-between mt-[20px] items-center '>
                  <div className='flex items-center gap-[7px]'>
                    <img className='w-[50px] h-[50px] rounded-[50%]' src={btn.avatarUser} alt="" />
                    <Link className='no-underline' href={`/user/${btn.idUser}`}><div className='font-bold'>{btn.userNameUser}</div></Link>
                    
                    <div className='w-[4px] h-[4px] rounded-[50%] bg-gray-500'></div>
                    <div className='text-gray-500 text-[14px]'>{convertTime((new Date().getTime()-btn.date)/60000)}</div>
                    <div className='w-[4px] h-[4px] rounded-[50%] bg-gray-500'></div>
                    <div className='text-[rgb(0,144,237)] font-[600] text-[14px]'>{returnStatusFollow(btn.idUser)}</div>
                  </div>
                  <div className='flex gap-[3px]'>
                    <div className='w-[3px] h-[3px] rounded-[50%] bg-gray-500'></div>
                    <div className='w-[3px] h-[3px] rounded-[50%] bg-gray-500'></div>
                    <div className='w-[3px] h-[3px] rounded-[50%] bg-gray-500'></div>
                  </div>
                </div>
                  {/* title end */}
                  {btn.images.length==1?(
                    <img className='d-block w-[500px] max-h-[400px] object-cover' src={btn.images[0]} alt="" />
                  ):(
                    <div style={{position:'relative',zIndex:'-1'}}>
                    <Carousel data-bs-theme="dark" className=' mt-[20px] '>
                      {btn.images.map((item,index)=>(
                        <Carousel.Item key={index} className=''>
                          <Image
                             alt='Image'
                             src={item}
                             width={500}
                             height={400}
                          />
                          
                        </Carousel.Item>
                      ))}
                    
                    </Carousel>
                    </div>
                  )}
                   {/* favourist and comments start */}
                    <div className='flex flex-col gap-[10px] mt-[20px]'>
                        <div className='flex justify-between'>
                          <div className='flex gap-[10px] text-[20px]'>
                              <i onClick={()=>likePost(btn)} className={`bx bx-heart bx-border hover:border-gray-400 cursor-pointer ${btn.favouristUsersById.find(item=>item===userOnline.id)?'text-red-700':''}`}></i>
                              <i onClick={()=>viewComments(btn)} className='bx bxs-comment bx-border-circle hover:border-gray-400 cursor-pointer'></i>
                              <i className='bx bxs-share bx-border hover:border-gray-400 cursor-pointer'></i>
                          </div>
                          <div>
                          <i className='bx bxs-bookmark-minus text-[22px]'></i>
                          </div>
                        </div>
                        <div className='font-bold text-[14px]'> {btn.favouristUsersById.length} lượt thích</div>
                        {btn.detail!==''&&
                        <div className='flex gap-[5px] items-center'>
                          <div className='font-bold'>{btn.userNameUser}</div>
                          <div className='h-[20px] text-[14px]'>{btn.detail}</div>
                          {/* <div className='text-[14px] text-gray-500 cursor-pointer'>More</div> */}
                        </div>}
                        <div className='text-[13px] font-bold'>Xem bản dịch</div>
                        {btn.commentsById.length>0&&
                        <div onClick={()=>viewComments(btn)} className='text-gray-500 text-[14px] cursor-pointer hover:text-gray-700'>Xem tất cả {totalComments(btn.commentsById)} bình luận</div>}
                       
                    </div>
                    {/* favourist and comments end */}
              </div>
            ))}
           
          </div>
      </main>
       {/* Post end */}

      {/* User start */}
      <section className='p-[20px] font-bold'>
         <div className='flex flex-col gap-[20px] '>
          <div className='flex justify-between'>
               
                  <div className='flex items-center'>
                      <img className='w-[50px] h-[50px] rounded-[50%]' src={userOnline?.avatar} alt="" />
                        <p className=''>{userOnline?.username}</p>
                  </div>
                         
               <a className='text-orange-600 text-[14px] no-underline'>Chuyển</a>
          </div>
          <div className='flex justify-between'>
               <p className='text-gray-500 font-bold'>Gợi ý cho bạn</p>
               <a className='text-orange-600 text-[14px] no-underline'>Xem tất cả</a>
          </div>
          <div className='flex flex-col gap-[10px]'>
              {usersUnFolow.map(btn=>(
                 <div key={btn.id} className='flex justify-between items-center'>
                 <div className='flex items-center'>
                    <Link className='no-underline' href={`/user/${btn.id}`}><img className='w-[50px] h-[50px] rounded-[50%]' src={btn.avatar} alt="" /></Link> 
                     <div>
                        <Link className='no-underline' href={`/user/${btn.id}`}><p className=''>{btn.username}</p> </Link> 
                        <p className='text-gray-400 text-[14px] font-normal'> Gợi ý cho bạn</p>
                     </div>
                 </div>
                 <div onClick={()=>followUser(btn)} className='text-orange-600 text-[14px] cursor-pointer'>{btn.requestFollowById?.includes(userOnline?.id)?"Đã gửi yêu cầu theo dõi":'Theo dõi'}</div>
            </div>
              ))}
          </div>
         </div>
      </section>
      {/* User end */}
      </div>     
    </div>
  )
}
