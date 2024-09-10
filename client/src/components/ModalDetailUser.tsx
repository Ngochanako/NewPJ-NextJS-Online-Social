import React from 'react'
import { useDispatch } from 'react-redux'
import { disableModalDetailUser } from '../store/reducers/ModalReducer';
import { User } from '../interfaces';
type Prop={
    user:User
}
export default function ModalDetailUser({user}:Prop) {
    const dispatch=useDispatch();
    const closeModal=()=>{
         dispatch(disableModalDetailUser());
    }
  return (
    <div className='modal'>
    <div onClick={closeModal} className='modal-close z-2'></div>
    <div className='flex flex-col gap-[20px] py-[20px] rounded-[10px] bg-white w-[800px] items-center'>
    <i onClick={closeModal} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-white top-[20px] right-[20px] absolute"></i>
        <div className='flex gap-[5px]'>
            <div className='font-bold'>Id:</div>
            <div>{user.id}</div>
        </div>
        <hr/>
        <div className='flex gap-[5px]'>
            <div className='font-bold'>Password:</div>
            <div>{user.password}</div>
        </div>
        <hr/>
        <div className='flex gap-[5px]'>
            <div className='font-bold'>Gender:</div>
            <div>{user.gender}</div>
        </div>
        <hr />
        <div className='flex gap-[5px]'>
            <div className='font-bold'>Biography:</div>
            <div>{user.biography}</div>
        </div>
        <hr />
        <div className='flex gap-[5px]'>
            <div className='font-bold'>Private:</div>
            <div>{user.private?"Yes":"No"}</div>
        </div>          
    </div>
  
</div>
  )
}
