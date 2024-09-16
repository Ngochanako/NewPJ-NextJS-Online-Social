import React, { useEffect, useRef, useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { useDispatch, useSelector } from 'react-redux';
import { activeModalEditPost, activeModalUpdatePost, disableModalAllComment } from '../store/reducers/ModalReducer';
import { CommentChild, CommentParent, Post, State } from '../interfaces';
import axios from 'axios';
import { setPost } from '../store/reducers/PostReducer';
import { v4 as uuidv4 } from 'uuid';
import { convertTime } from '@/interfaces/convertTime';
import Link from 'next/link';
import { addNewCommentParent, getCommentsParent, updateCommentsParent } from '@/services/commentsParent.service';
import { addNewCommentChild, getCommentsChild } from '@/services/commentsChild.service';
import { getPosts, updatePost } from '@/services/posts.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import '@/styles/modal.css'
import { updateUser } from '@/services/users.service';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Image from 'next/image';
export default function ModalAllComment() {
    const commentsRef=useRef<{[key:string]:HTMLDivElement|null}>({});
    const refEnd=useRef<HTMLDivElement|null>(null);;
    const router=useRouter();
    const pathName=usePathname();
    const commentsChild=useSelector((state:State)=>state.commentsChild);
    const commentsParent=useSelector((state:State)=>state.commentsParent);
    const userOnline=useSelector((state:State)=>state.user)
    const dispatch=useDispatch();
    const posts=useSelector((state:State)=>state.posts);
    const [post,setPostPage]=useState<Post>({
        id:'',
        idUser:'',
        avatarUser:'',
        userNameUser:'',
        detail:'',
        date:0,
        fullDate:'',
        images:[],
        commentsById:[],
        favouristUsersById:[], 
        idGroup:null,
        status:'',
        lock:false,
        });
    // const post:Post=useSelector((state:State)=>state.post);
    const [valueUserName,setValueUserName]=useState<string>('')
    const [user,setUser]=useState<any>({
        id:'',
        username:'',
        password:'',
        email:'',
        avatar:'',
        biography:'',
        gender:'',
        postsById:[],
        followersById:[],
        status:true,
        private:true
    });
    const [visibleComments,setVisibleComment]=useState<any>({});
    const [idCommentViewMore,setIdCommentViewMore]=useState<string>('');
    const [valueComment, setValueComment]=useState<string>('');
    const [typeCommentPost,setTypeCommentPost]=useState<{type:string,idComment:string,userName:string,idUser:string}>({type:'',idComment:'',userName:'',idUser:''});
    const [commentsParentUser,setCommentsParentUser]=useState<CommentParent[]>([]);
    const postLocal=useSelector((state:State)=>state.post);
    const searchParam=useSearchParams();
    
    useEffect(()=>{
        let idPost=searchParam.get('id');
        if(idPost){
            axios.get(`http://localhost:3000/posts/${idPost}`)
            .then(response=>setPostPage(response.data))
            .catch(err=>console.log(err))
        }else{
           
            setPostPage(postLocal);
        }
    },[searchParam,posts])
    //get CommentParent from API
    useEffect(()=>{
       dispatch(getCommentsParent());
    },[])
     //get CommentChild from API
     useEffect(()=>{
        dispatch(getCommentsChild());
     },[])
    //get CommentParent of Post
    useEffect(()=>{
        if(post){
            let newCommentsParent:CommentParent[]=[];
            for(let btn of post.commentsById){
                let newCommentParent=commentsParent.find(item=>item.id===btn);
                if(newCommentParent){
                    newCommentsParent.push(newCommentParent);
                }
            }
            setCommentsParentUser(newCommentsParent); 
        }            
    },[commentsParent,post])
    //get CommentsChild of Post
    const commentsChildUser=(comments:string[])=>{
        let newCommentsChild:CommentChild[]=commentsChild.filter((btn)=>comments.includes(btn.id));
        return newCommentsChild;
    }
    // get user of Post
    useEffect(()=>{
        if(post){
            axios.get(`http://localhost:3000/users/${post.idUser}`)
            .then(response=>setUser(response.data))
            .catch(err=>console.log(err))
        }   
    },[post])
    //close Modal
    const closeModal=()=>{
        dispatch(disableModalAllComment())
        router.push(pathName)
    }
    //follow User
    const followUser=()=>{
        let newUser={
            ...user,
            requestFollowById:[...user.requestFollowById,userOnline.id]
        }
        dispatch(updateUser(newUser));
    }
    //view more Comment
    const viewMoreComment=(idComment:string,lengthComments:number)=>{
          setIdCommentViewMore(idComment);
         setVisibleComment((prev:any)=>({
            ...prev,
            [idComment]:prev[idComment]==lengthComments?0:(prev[idComment]||0)+1
         }));
    }
    // like or unlike Post
    const favouristPost=()=>{
        if(post.favouristUsersById.find(btn=>btn==userOnline.id)){
            let newPost={
                ...post,
                favouristUsersById:post.favouristUsersById.filter(btn=>btn!==userOnline.id)
            }
            // dispatch(setPost(newPost));
            setPostPage(newPost);
            dispatch(updatePost(newPost));
        }else{
            let newPost={
                ...post,
                favouristUsersById:[...post.favouristUsersById,userOnline.id]
            }
            setPostPage(newPost)
            dispatch(updatePost(newPost));
            //create new Notify and upload to firebase
            if(userOnline.id!=user.id){
                const newNotify=async()=>{
                    try {
                       const docREf=await addDoc(collection(db,'notifications'),{
                        detail:`${userOnline.username} vừa thích bài viết của bạn`,
                        url:`/home?id=${post.id}`,
                        idUser:user.id,
                        status:false,
                        created:serverTimestamp(),
                        idUserSendNotify:userOnline.id
                       }) 
                    } catch (error) {
                        console.log(error);                  
                    }
                }
                newNotify();
            }
        }
    }
    //handleChange Comment
    const handleChangeComment=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        let value=e.target.value;
        if(value==''){
            setTypeCommentPost({type:'',idComment:'',userName:'',idUser:''})
        }
        setValueComment(value);
    }
    // post Comment
    const postComment=(e:React.FormEvent)=>{
        e.preventDefault();
        
        if(typeCommentPost.type==''){
            let newComment:CommentParent={
                id:uuidv4(),
                idUser:userOnline.id,
                avatarUser:userOnline.avatar,
                userNameUser:userOnline.username,
                postId:post.id,
                detail:valueComment,
                date:new Date().getTime(),
                commentsById:[]
            }
            dispatch(addNewCommentParent(newComment));
            let newPost:Post={
                ...post,
                commentsById:[...post.commentsById,newComment.id]
            }
            dispatch(updatePost(newPost));
            setPostPage(newPost);
            // dispatch(setPost(newPost));
            //create new Notify and update to firebase
            if(userOnline.id!==user.id){
                const newNotify=async()=>{
                    try {
                        const docREf=await addDoc(collection(db,'notifications'),{
                        detail:`${userOnline.username} đã bình luận bài viết của bạn`,
                        url:`/home?id=${post.id}&idComment=${newComment.id}`,
                        idUser:user.id,
                        status:false,
                        created:serverTimestamp(),
                        idUserSendNotify:userOnline.id
                        }) 
                    } catch (error) {
                        console.log(error);                  
                    }
                }
                newNotify();
            }
            //cuộn trang đến tin nhắn mới nhất
            refEnd.current?.scrollIntoView({behavior:'smooth'})
        }else if (typeCommentPost.type==='replyParent'){
            let newComment:CommentChild={
                id:uuidv4(),
                idUser:userOnline.id,
                avatarUser:userOnline.avatar,
                userNameUser:userOnline.username,
                postId:post.id,
                idParent:typeCommentPost.idComment,
                userNameParent:typeCommentPost.userName,
                detail:valueComment,
                date:new Date().getTime()
            }
            dispatch(addNewCommentChild(newComment));
            
            axios.get(`http://localhost:3000/commentsParent/${typeCommentPost.idComment}`)
            .then(response=>{
                let updateCommentParent:CommentParent={...response.data,commentsById:[...response.data.commentsById,newComment.id]};
                dispatch(updateCommentsParent(updateCommentParent))
                dispatch(getPosts());
            })
            .catch(err=>console.log(err))
           // create new Notify and update to firebase
           if(userOnline.id!==typeCommentPost.idUser){
            const newNotify=async()=>{
                try {
                    const docREf=await addDoc(collection(db,'notifications'),{
                    detail:`${userOnline.username} đã trả lời bình luận của bạn`,
                    url:`/home?id=${post.id}&idComment=${newComment.id}`,
                    idUser:typeCommentPost.idUser,
                    status:false,
                    created:serverTimestamp(),
                    idUserSendNotify:userOnline.id
                    }) 
                } catch (error) {
                    console.log(error);                  
                }
            }
            newNotify();
           }
            //cuộn trang đến tin nhắn mới nhất
            commentsRef.current[typeCommentPost.idComment]?.scrollIntoView({behavior:'smooth'})
        }
        setValueComment('');
        setTypeCommentPost({type:'',idComment:'',userName:'',idUser:''});
    }
    //reply Comment
    const replyComment=(idComment:string,usernameParent:string,idUser:string)=>{
        setTypeCommentPost({type:'replyParent',idComment:idComment,userName:usernameParent,idUser:idUser});
        setValueComment(`@${usernameParent} `);
        setValueUserName(`@${usernameParent} `)
    }
    //open Modal Update Post
    const openModalUpdatePost=()=>{
        dispatch(activeModalUpdatePost())
    }
    //handle text in area
    const handleKeyDown = (event:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Backspace'&&valueComment===valueUserName) {
          // Xóa toàn bộ đoạn text khi nhấn Backspace
          setValueComment('');
          setTypeCommentPost({type:'',idComment:'',userName:'',idUser:''})
          event.preventDefault();
        }
      };
    //
    useEffect(()=>{
       //check if idComment of URL is available then scroll to view
       let idComment=searchParam.get('idComment');
       if(idComment){
           commentsRef.current[idComment]?.scrollIntoView({behavior:'smooth'});
       }else{
           refEnd.current?.scrollIntoView({behavior:'smooth'}) 
       }
    },[commentsParent])
  return (
    <div className='modal'>
        <div onClick={closeModal} className='modal-close z-[1]'></div>
        <div className='formModalAllComment flex'>
        <i onClick={closeModal} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-white top-[20px] right-[20px] absolute"></i>
            {/* Slider Img or video */}
            <Carousel data-bs-theme="dark" className='mt-[20px] w-[380px]'>
                {post?.images.map((btn,index)=>(
                   <Carousel.Item className='' key={index}>
                   <img
                   className="d-block w-[380px] h-[400px] object-cover "
                   src={btn}
                   alt=""
                   />
               </Carousel.Item> 
                ))}
           </Carousel>
           {!post.lock?
             <div className='flex flex-col gap-[10px] p-[10px] w-[420px]'>
             <div className='flex justify-between'>
                 <div className='flex items-center'>
                         <img className='w-[50px] h-[50px] rounded-[50%]' src={user.avatar} alt="" />
                         <div className='font-bold'><Link className='no-underline' href={`/user/${user.id}`}>{user.username}</Link></div>
                 </div>
                 {userOnline?.id==user.id&&<div onClick={openModalUpdatePost} className='flex items-center gap-[5px] cursor-pointer hover:text-gray-400'>
                     <div className='w-[3px] h-[3px] bg-gray-600 rounded-[50%]'></div>
                     <div className='w-[3px] h-[3px] bg-gray-600 rounded-[50%]'></div>
                     <div className='w-[3px] h-[3px] bg-gray-600 rounded-[50%]'></div>
                 </div>}
             </div>
             
             <hr />
              {/* All comment start */}
              <div className='all-comment flex flex-col gap-[15px] overflow-auto max-h-[250px]'>
              <div className='flex items-center'>
                         <img className='w-[50px] h-[50px] rounded-[50%]' src={user.avatar} alt="" />
                         <div>
                             <div className='font-bold'><Link className='no-underline' href={`/user/${user.id}`}>{user.username}</Link> <span className='font-normal text-[14px]'>{post?.detail}</span></div>
                             <div className='text-[14px] text-gray-500'>{convertTime((new Date().getTime()-post?.date)/60000)}</div>
                         </div>
                         
                 </div>
                 {commentsParentUser.length===0&&<div className='text-orange-400 font-bold text-[14px] text-center text-opacity-90 italic'>Chưa có bình luận nào cho bài viết này !</div>}
                 {commentsParentUser.map(btn=>(
                     <div key={btn.id} className='flex flex-col'>
                         <div className='flex justify-between items-center'>
                             <div className='flex items-center'>
                                 <img className='w-[50px] h-[50px] rounded-[50%]' src={btn.avatarUser} alt="" />
                                 <div>
                                     <p className='text-[14px] font-bold'><Link className='no-underline' href={`/user/${btn.idUser}`}>{btn.userNameUser}</Link><span className='text-[14px] font-normal'> {btn.detail}</span> </p>
                                     <div ref={(el)=>{commentsRef.current[btn.id]=el}} className='flex gap-[20px] text-gray-500 text-[12px]'>
                                         <div>{convertTime((new Date().getTime()-btn.date)/60000)}</div>
                                         <div onClick={()=>replyComment(btn.id,btn.userNameUser,btn.idUser)} className='hover:text-gray-800 cursor-pointer'>Trả lời</div>
                                     </div>
                                 </div>
                             </div>
                             <i className='bx bx-heart' ></i>
                         </div>
                         {commentsChildUser(btn.commentsById).length>0?
                            (<div className='flex gap-[20px] text-gray-500 font-bold text-[12px]'>
                                <div>------------</div>
                                <div>                                     
                                     <div className={idCommentViewMore===btn.id?'flex flex-col gap-[10px]':'hidden flex flex-col gap-[10px]'}>
                                         {commentsChildUser(btn.commentsById).slice(0,visibleComments[btn.id]).map(item=>(
                                         <div className='flex justify-between items-center' ref={(el)=>{commentsRef.current[item.id]=el}} key={item.id}>
                                             <div className='flex items-center'>
                                                 <img className='w-[50px] h-[50px] rounded-[50%]' src={item.avatarUser} alt="" />
                                                 <div>
                                                     <div className='flex gap-[5px] items-center'><Link className='text-black' href={`/user/${item.idUser}`}>{item.userNameUser}</Link> {item.detail}</div>
                                                     <div className='flex gap-[20px] text-gray-500 text-[12px]'>
                                                         <div>{convertTime((new Date().getTime()-item.date)/60000)}</div>
                                                         <div onClick={()=>replyComment(btn.id,item.userNameUser,item.idUser)}  className='hover:text-gray-800 cursor-pointer'>Trả lời</div>
                                                     </div>
                                                 </div>
                                             </div>
                                             <i className='bx bx-heart' ></i>
                                         </div>
                                         ))}
                                         
                                     </div>
                                     <div className='hover:text-gray-800 cursor-pointer' onClick={()=>viewMoreComment(btn.id,btn.commentsById.length)}>{visibleComments[btn.id]!==btn.commentsById.length?'Xem thêm bình luận':'Ẩn tất cả bình luận'}{visibleComments[btn.id]!==btn.commentsById.length?`(${btn.commentsById.length-(visibleComments[btn.id]||0)})`:''}</div>
                                 </div>
                               
                            </div>):('')
                         }
                     </div>
                     
                 ))}     
                 <div ref={refEnd}></div>
              </div>
             {/* All Comment end */}
             <hr />
             {/* Favourist */}
             <div className='flex justify-between'>
                <div className='flex gap-[10px] text-[20px]'>            
                   <i onClick={favouristPost} className={`bx bx-heart bx-border hover:border-gray-400 cursor-pointer ${post?.favouristUsersById.find(btn=>btn===userOnline.id)?'text-red-700':''}`}></i>
                   <i className='bx bxs-comment bx-border-circle hover:border-gray-400 cursor-pointer'></i>
                   <i className='bx bxs-share bx-border hover:border-gray-400 cursor-pointer'></i>
                </div>
                <div>
                <i className='bx bxs-bookmark-minus text-[22px]'></i>
                </div>
             </div>
             <div className='font-bold text-[14px]'> {post?.favouristUsersById.length} lượt thích</div>
             <div className='text-gray-500 text-[14px]'>{post?.fullDate}</div>
             
             {/* Comment */}
             <form className=''>
                 <div className='flex items-center justify-between gap-[10px]'>
                 <textarea   onKeyDown={handleKeyDown} onChange={handleChangeComment} value={valueComment} className=' resize-none text-[14px] placeholder:italic placeholder:text-slate-400 block w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm w-[80%] max-h-[100px]' placeholder='Thêm bình luận' />
                 <button onClick={postComment} className='bg-[rgb(79,70,229)] text-white p-[5px] rounded-[5px] text-[14px] hover:bg-purple-500'>Đăng</button>
                 </div>             
             </form>
         </div> 
            :<div className='text-red-500 font-bold text-center'>Bài viết đã bị khóa!</div>
            }   
            
        </div>  
    </div>
  )
}

