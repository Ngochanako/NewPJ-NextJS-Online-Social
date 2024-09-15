'use client'
import { db } from '@/config/firebase';
import { Room, State, User } from '@/interfaces';
import { getUsers } from '@/services/users.service';
import { disableModalNewMessage } from '@/store/reducers/ModalReducer'; 
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import '@/styles/modal.css'
export default function ModalNewMessage() {
    //initialize
    
    const userOnline=useSelector((state:State)=>state.user);
    const router=useRouter();
    const users=useSelector((state:State)=>state.users);
    const dispatch=useDispatch();
    const [search,setSearch]=useState<string>('');
    const [rooms,setRooms]=useState<Room[]>([]);
   // get list rooms from firebase
    useEffect(()=>{
        if(userOnline){
            const q=query(collection(db,'chats'),where('usersById','array-contains',userOnline.id));
            const unsubcribe=onSnapshot(q,(querySnapshot)=>{
            let rooms:Room[]=[];
            if(querySnapshot.empty){
               console.log('Không có dữ liệu');             
            }else{
                querySnapshot.forEach((doc)=>{
                    const data=doc.data() as Room;
                    rooms.push({
                    ...data,
                    id:doc.id
                    })
                })
                setRooms(rooms);
            }
            })
            //cleanup listener on unmount
            return () => unsubcribe();
        }
     },[userOnline])
    //get data from API
    useEffect(()=>{
        dispatch(getUsers());
    },[])
    //close the modal
    const closeModal=()=>{
        
        dispatch(disableModalNewMessage());
    }
    //handle change input
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        
        setSearch(e.target.value)   
    }
    //handle click button Chat
    const handleClick=async(user:User)=>{
      
        //check if room is available?
        const roomFind=rooms.find(room=>[user.id,userOnline.id].every(id=>room.usersById.includes(id)));
        //if room is available
        if(roomFind){
            router.push(`/message/${roomFind.id}`)
        }else{
         //create new Room
           
            try {
                const docRef = await addDoc(collection(db, "chats"), {
                    created:serverTimestamp(),
                    newTime:serverTimestamp(),
                    avatarUser:user.avatar,
                    userNameUser:user.username,
                    hasMessage:false,
                    usersById:[user.id,userOnline.id],
                    status:true
                });
                console.log(docRef.id);
                router.push(`/message/${docRef.id}`)
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } 
        dispatch(disableModalNewMessage());
    }
  return (
    <div className='modal'>
        <div onClick={closeModal} className='modal-close z-2'></div>
        <div className='flex flex-col gap-[10px] py-[20px] rounded-[10px] bg-white w-[500px] z-3'>
            <i onClick={closeModal} className="fa-solid fa-xmark z-3 text-[30px] cursor-pointer text-white top-[20px] right-[20px] absolute"></i>
            <div className=' text-red-300 text-[20px] text-center'>Tin nhắn mới</div>
            <div>
                <div className='flex gap-[10px] p-[10px]'>
                    <div className='font-bold text-orange-400'>Tới: </div>
                    <input onChange={handleChange} value={search} className='outline-none' type="text" placeholder='Tìm kiếm...' />
                </div>
                <div className='flex flex-col gap-[10px] max-h-[200px] overflow-auto py-[10px] px-[20px]'>
                    {search&&users.filter(user=>user.id!==userOnline?.id&&user.username.includes(search)).map(user =>(
                        <div className='flex items-center justify-between' key={user.id}>
                            <div className='flex items-center'>
                                <img className='rounded-[50%] w-[50px] h-[50px]' src={user.avatar} alt="" />
                                <div>{user.username}</div>
                            </div>
                            <button onClick={()=>handleClick(user)} className='bg-[rgb(0,149,246)] text-white rounded-[10px] p-[10px]'>Chat</button>
                        </div>
                    ))}
                </div>
            </div>
           
            <div onClick={closeModal} className='cursor-pointer text-center text-[14px] text-red-300'>Hủy</div>           
        </div>
      
    </div>
  )
}
