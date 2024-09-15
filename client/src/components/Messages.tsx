'use client'
import { Room, State } from '@/interfaces'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { usePathname, useRouter } from 'next/navigation'
import style from '@/styles/message.module.css'
import { getUsers } from '@/services/users.service'
import { activeModalNewMessage } from '@/store/reducers/ModalReducer'
import ModalNewMessage from './ModalNewMessage'
export default function Messages() {
    const userOnline=useSelector((state:State)=>state.user);
    const [listRoom,setListRoom]=useState<Room[]>([]);
    const pathname=usePathname();
    const router=useRouter();
    const users=useSelector((state:State)=>state.users);
    const dispatch=useDispatch();
    const modal=useSelector((state:State)=>state.modal);
    //get data 
    useEffect(()=>{
       dispatch(getUsers())
    },[])
    //get list rooms chat from firebase
    useEffect(() => {
      if (userOnline) {
        const q = query(
          collection(db, 'chats'),
          where('usersById', 'array-contains', userOnline.id),
          where('hasMessage', '==', true),
          orderBy('newTime','desc')
        );
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let rooms: Room[] = [];
          if (querySnapshot.empty) {
            console.log("Không có tài liệu nào thỏa mãn điều kiện truy vấn.");
          } else {
            let rooms: Room[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data() as Room;
              rooms.push({
                ...data,
                id: doc.id,
              });
            });
            setListRoom(rooms);
          }
        });
    
        // Cleanup listener on unmount
        return () => unsubscribe();
      }
    }, [userOnline]);
    
    //handle click room
    const handleClickRoom=(room:Room)=>{
        router.push(`/message/${room.id}`);
    }
    //render User
    const renderUser=(room:Room)=>{
        const userId= room.usersById.filter(id=>id!==userOnline?.id)[0];
        const user=users.find(u=>u.id===userId);
        const date=new Date(room.created.toDate()).toDateString();
        return(
          <div className='flex gap-[20px] cursor-pointer hover:text-red-300'>
            <img className='rounded-[50%] h-[50px] w-[50px]' src={user?.avatar} alt="" />
            <div>
                  <div className='font-bold'>{user?.username}</div>
                  <div className='text-[14px] text-gray-500'>{date}</div>
            </div>
           </div>
        )
    }
    //render all message end
    //handle click new message
    const handleClickNewMessage=()=>{
       dispatch(activeModalNewMessage());
    }
  // render component
  return (
    <div style={{borderRight:'1px solid rgb(207,204,204)'}} className= 'w-[25%] pl-[20px] pr-[20px] py-[40px] flex flex-col gap-[30px] border-r-solid'>
       {modal.newMessage&&<ModalNewMessage/>}
      <div className=' flex justify-between items-center text-[20px] font-bold'>
         {userOnline?.username}
         <i onClick={handleClickNewMessage} className="fa-solid fa-magnifying-glass cursor-pointer"></i>
      </div>
      <div>
        <img className='rounded-[50%] h-[50px] w-50px]' src={userOnline?.avatar} alt="" />
      </div>
      <div className='flex flex-col gap-[10px]'>
        <div className='flex justify-between items-center'>
            <div className='font-bold'>Tin nhắn</div>
            <div className='text-[14px] text-gray-600'>Tin nhắn đang chờ</div>
        </div>
        {/* all message start */}
        <div>
         {listRoom.map(room=>(
            <div onClick={()=>handleClickRoom(room)} className={pathname==`/message/${room.id}`?style.roomUser:''} key={room.id}>
                 {renderUser(room)}
            </div>
         ))}
         </div>
         {/* all message end */}
      </div>
    </div>
  )
}
