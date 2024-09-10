import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { disableModalAllComment, disableModalDelete, disableModalPost, disableModalUpdatePost } from '../store/reducers/ModalReducer';
import { Post, State, User } from '../interfaces';
import { deletePost } from '../services/posts.service';
import { resetPost } from '../store/reducers/PostReducer';
export default function ModalDelete() {
    const userOnline=useSelector((state:State)=>state.user);
    const dispatch=useDispatch();
    const post:Post=useSelector((state:State)=>state.post);
    const closeModal=()=>{
        dispatch(disableModalDelete());
    }
    const deletePostModal=()=>{
        dispatch(deletePost(post.id));
        dispatch(resetPost());
        dispatch(disableModalDelete());
        dispatch(disableModalAllComment());
    }
  return (
    <div className='modal'>
    <div onClick={closeModal} className='modal-close z-2'></div>
    <div className='flex flex-col gap-[20px] py-[20px] rounded-[10px] bg-white w-[400px] z-3'>
    <i onClick={closeModal} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-white top-[20px] right-[20px] absolute"></i>
        <div className='text-center cursor-pointer text-[16px] hover:text-gray-400'>Bạn có chắc chắn muốn xóa không ?</div>
        <hr/>
        <div onClick={deletePostModal} className='text-center cursor-pointer text-red-600 hover:text-red-400'>Xóa</div>
        <hr />
        <div onClick={closeModal} className='cursor-pointer text-center hover:text-gray-400'>Hủy</div>           
    </div>
  
    </div>
  )
}
