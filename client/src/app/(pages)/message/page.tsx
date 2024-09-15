'use client'
import HeaderMessage from '@/components/HeaderMessage'
import Messages from '@/components/Messages'
import ModalNewMessage from '@/components/ModalNewMessage'

import { Room, State } from '@/interfaces'
import { activeModalNewMessage } from '@/store/reducers/ModalReducer'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function page() {
  //initialise
    const dispatch=useDispatch();
    const modal=useSelector((state:State)=>state.modal);
    //open modal new Message
    const handleNewMessage=()=>{
        dispatch(activeModalNewMessage())   
    }
  return (
    <div style={{height:'600px'}} className='flex'>
      <title>Message</title>
      {modal.newMessage&&<ModalNewMessage/>}
      <HeaderMessage/>   
      {/* section message start */}
      <Messages/>
      {/* section message end */}

      {/* section boxchat start */}
      <div className='flex items-center justify-center min-h-[500px] text-center m-auto'>
              <div className='flex flex-col gap-[10px]'>
                  <i className="fa-brands fa-facebook-messenger text-[#565555] text-[60px]"></i>
                  <div className='text-[20px]'>Tin nhắn của bạn</div>
                  <div className='text-gray-500'>Gửi ảnh và tin nhắn riêng tư cho bạn bè và nhóm</div>
                  <button onClick={handleNewMessage} className='bg-[rgb(0,149,246)] text-white rounded-[10px] p-[10px] cursor-pointer hover:bg-[rgb(0,149,246,0.8)] '>Gửi tin nhắn</button>
              </div>
      </div>
      {/* section box chat end */}
      
    </div>
  )
}
