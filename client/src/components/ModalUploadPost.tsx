
import { disableModalUploadPost } from '../store/reducers/ModalReducer';
import Carousel from 'react-bootstrap/Carousel';
import  React, { useEffect, useState } from 'react';
import { Post, State, User } from '../interfaces';
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost } from '@/services/posts.service';
import '@/styles/modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faEarth, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
export default function ModalUploadPost() {
    const userOnline:User=useSelector((state:State)=>state.user);
    const router=useRouter();
    const dispatch=useDispatch();
    const previewImages=useSelector((state:State)=>state.previewImages)
    const imagesPost=useSelector((state:State)=>state.imagesPost);
    const [contentPost,setContentPost]=useState<string>('');
    const modalUploadPost=useSelector((state:State)=>state.modal.uploadPost);
    const group=useSelector((state:State)=>state.group)
    const [permissionToViewPostValue,setPermissionToViewPostValue]=useState<string>('Chọn quyền xem bài viết');
    const [selectPermissionToViewPostValue,setSelectPermissions]=useState<boolean>(false);
    const [notify, setNotify]=useState<boolean>(false);
    const closeModal=()=>{
        dispatch(disableModalUploadPost({type:'',status:false}));
    }
    //get count Char
    const handleChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setContentPost(e.target.value);
    }
    console.log(imagesPost)
    //upload new Post
    const uploadNewPost=()=>{
      //case not select perrmission view post
      if(permissionToViewPostValue=='Chọn quyền xem bài viết'){
        setNotify(true);
        return;
      }
      if(modalUploadPost.type==='personal'){
        let newPost:Post={
          id:uuidv4(),
          idUser:userOnline.id,
          detail:contentPost,
          date:new Date().getTime(),
          fullDate:new Date().toISOString().split('T')[0],
          images:imagesPost,
          favouristUsersById:[],
          idGroup:null,
          status:permissionToViewPostValue,
          avatarUser:userOnline.avatar,
          userNameUser:userOnline.username,
          commentsById:[],
          lock:false
         }             
         dispatch(addNewPost(newPost));
         dispatch(disableModalUploadPost({type:'',status:false}));
       } else if(modalUploadPost.type==='group'){
        
        let newPost:Post={
          id:uuidv4(),
          idUser:userOnline.id,
          detail:contentPost,
          date:new Date().getTime(),
          fullDate:new Date().toISOString().split('T')[0],
          images:imagesPost,
          favouristUsersById:[],
          idGroup:group.id,
          status:permissionToViewPostValue,
          avatarUser:userOnline.avatar,
          userNameUser:userOnline.username,
          commentsById:[],
          lock:false
         }  
         dispatch(addNewPost(newPost));
         dispatch(disableModalUploadPost({type:'',status:false}));     
       }      
    }
    //open select permissions to view Post
    const openSelectPermissionToViewPost=()=>{
      setSelectPermissions(!selectPermissionToViewPostValue);
    }
    //handle select permissions
    const handleSelectPermission=(e:React.MouseEvent<HTMLDivElement>)=>{
         setNotify(false);
        const value=e.currentTarget.dataset.value;
        if(value=='1'){
          setPermissionToViewPostValue('Công khai');
          setSelectPermissions(false);
        }else if(value=='2'){
          setPermissionToViewPostValue('Riêng tư');
          setSelectPermissions(false);
        }else{
          setPermissionToViewPostValue('Chỉ mình tôi');
          setSelectPermissions(false);
        }
    }
  return (
<div className='modal'>
    <div onClick={closeModal} className='modal-close z-[2]'></div>
    <div className='flex flex-col gap-[20px] py-[20px] rounded-[10px] bg-white w-[800px] z-[3]'>
    <i onClick={closeModal} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-white top-[20px] right-[20px] absolute"></i>
        <div onClick={uploadNewPost} className='text-[16px] font-bold text-center text-orange-400 hover:text-orange-700 cursor-pointer'>Chia sẻ</div>
        <hr/>
        <div className='flex'>
            {/* Album ảnh vừa chọn */}
            {imagesPost.length>1?(
               <Carousel data-bs-theme="dark" className='mt-[20px] w-[380px]'>
               {imagesPost.map((img,index)=>(
                   <Carousel.Item className='' key={index}>
                   <img
                   className="d-block w-[380px] h-[400px] object-cover "
                   src={img}
                   alt=""
                   />
                   </Carousel.Item>
               ))}
          </Carousel>
            ):(
                <img
                className="d-block w-[380px] max-h-[400px] object-cover "
                src={imagesPost[0]}
                alt=""
                />  
            )}
           <div className='p-[20px]'>
              <div className='flex gap-[20px] items-center'>
                <img className='w-[50px] h-[50px] rounded-[50%]' src={userOnline?.avatar} alt="" />
                <div className=''>
                    <div className='font-bold'>{userOnline?.username} </div>
                    <div onClick={openSelectPermissionToViewPost} className='cursor-pointer'><FontAwesomeIcon icon={faChevronDown} /> {permissionToViewPostValue}</div>
                    {selectPermissionToViewPostValue&&<div className='absolute bg-white rounded-[5px] p-[10px] shadow-lg right-[450px]'>
                      <div data-value='1' onClick={handleSelectPermission} className='flex gap-[10px] items-center cursor-pointer hover:bg-gray-200 p-[5px]'>
                        <FontAwesomeIcon icon={faEarth}/>
                        Công khai
                      </div>
                      <div data-value='2' onClick={handleSelectPermission} className='flex gap-[10px] items-center cursor-pointer hover:bg-gray-200 p-[5px]'>
                        <FontAwesomeIcon icon={faUser}/>
                        Riêng tư
                      </div>
                      <div data-value='3' onClick={handleSelectPermission} className='flex gap-[10px] items-center cursor-pointer hover:bg-gray-200 p-[5px]'>
                        <FontAwesomeIcon icon={faLock}/>
                        Chỉ mình tôi
                      </div>
                    </div>}
                    {notify&&<div className='text-red-600 text-[12px] font-bold'>Bạn chưa chọn quyền xem bài viết?</div>}
                </div>
              </div>
              <textarea onChange={handleChange} maxLength={200} className='mt-[50px]' id="white-textarea" placeholder='Viết chú thích...'></textarea>
              <p className='text-[14px] text-gray-500'>{contentPost.length}/200 ký tự</p>
           </div>
        </div>              
    </div>
  
</div>
  )
}
