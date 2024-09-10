import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { activeModalUploadPost, disableModalPost } from '../store/reducers/ModalReducer';
import { State } from '../interfaces';
import { setImagesPost } from '@/store/reducers/ImagesPostReducer';
import { setPreviewImages } from '@/store/reducers/PreviewImagesReducer';
import '@/styles/modal.css'
export default function ModalCreatePost() {
    const [images, setImages] = useState<any[]>([]);
    const modalCreatePost=useSelector((state:State)=>state.modal.post)
    const dispatch=useDispatch();
    const closeModal=()=>{
        dispatch(disableModalPost({type:'',status:false}));
    }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const files = e.target.files;
        const newPreviewImages:any = [];       
        if(files){
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                images.push(file);
                const src = URL.createObjectURL(file);
                newPreviewImages.push(src);                      
            }           
            dispatch(setImagesPost(images)) 
            dispatch(setPreviewImages(newPreviewImages));
            if(modalCreatePost.type=='personal'){
                dispatch(disableModalPost({type:'personal',status:false}));
                dispatch(activeModalUploadPost({type:'personal',status:true}));
            }else if(modalCreatePost.type=='group'){
                dispatch(disableModalPost({type:'group',status:false}));
                dispatch(activeModalUploadPost({type:'group',status:true}));
            }                  
        } 
    }
  return (
    <div className='modal'>
    <div onClick={closeModal} className='modal-close z-[1]'></div>
    <div className='flex flex-col gap-[20px] py-[20px] rounded-[10px] bg-white w-[400px] z-[3]'>
        <i onClick={closeModal} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-white top-[20px] right-[20px] absolute"></i>
        <div className='text-[16px] font-bold text-center'>Tạo bài viết mới</div>
        <hr/>
        <div className='flex flex-col items-center justify-center min-h-[300px] gap-[20px]'>
            <i className='bx bx-images text-[80px]'></i>
            <div className='text-orange-600 text-[20px] text-center cursor-pointer'>Kéo ảnh và video vào đây</div>
            <form action="">
                 <input onChange={handleChange} className='hidden' type="file" id='post' multiple />
                 <label className='border-transparent bg-[rgb(0,149,246)] text-white rounded-[5px] p-[5px]' htmlFor="post">Chọn từ máy tính</label>
            </form> 
        </div>               
    </div>
  
</div>
  )
}
