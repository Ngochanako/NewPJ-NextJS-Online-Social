'use client'
import HeaderMessage from '@/components/HeaderMessage'
import Messages from '@/components/Messages'
import { db } from '@/config/firebase'
import { Message, MessageGroupByDate, Room, State, User } from '@/interfaces'
import HeaderLeft from '@/layouts/HeaderLeft'
import axios from 'axios'
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
type ParamProps={
    params:{
        id:string
    }
}
export default function page({params}:ParamProps) {
    const messagesEndRef=useRef<HTMLDivElement|null>(null);
    const userOnline=useSelector((state:State)=>state.user);
    const idRoom=params.id;
    const [message,setMessage]=useState<string>('');
    const [listMessage,setListMessage]=useState<MessageGroupByDate>({})
    const [room,setRoom]=useState<Room>({
      id:'',
    created:'',
    newTime:'',
    usersById:[],
    hasMessage:false,
    status:false,
    })
    const [friend,setFriend]=useState<User|null>(null)
    //get data of room 
    useEffect(() => {
      const fetchRoomData = async () => {
        const roomRef = doc(db, 'chats', idRoom);
        const data = await getDoc(roomRef);
        if (data.exists()) {
          setRoom(data.data() as Room);
          const user=JSON.parse(localStorage.getItem('user')||'null');
          const idFriend=data.data().usersById.filter((id:string)=>id!=user?.id)[0];
          axios.get(`http://localhost:3000/users/${idFriend}`)
          .then(res=>setFriend(res.data))
          .catch(err=>console.log(err))
        }
      };
      
      fetchRoomData();
    }, [idRoom]);
    //get user
    //get list message of room
    useEffect(()=>{
       const q=query(collection(db,'messages'),where('idRoom','==',idRoom),orderBy('created'));
      const unsubscribe= onSnapshot(q,(querySnapshot)=>{
          let list:Message[]=[];
          querySnapshot.forEach((doc)=>{
              list.push({...doc.data() as Message,id:doc.id})
          })
          const listByDate: MessageGroupByDate = list.reduce((acc, msg) => {
            const date = new Date(msg.created?.toDate()).toDateString();
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(msg);
            return acc;
          }, {} as MessageGroupByDate);
          setListMessage(listByDate);
       })
       return ()=> unsubscribe();
    },[])
    //render message
    const renderMessages = () => {
      let previousId = '';
    
      return Object.keys(listMessage).map((date) => {
        return (
          <div key={date}>
            <div className='text-[14px] text-gray-500 text-center'>{date}</div>
            {listMessage[date].map((msg) => {
              // Kiểm tra và cập nhật biến showAvatar
              const showAvatar = previousId !== msg.idUser||previousId==='';
              if(msg.idUser!==userOnline.id){
                previousId = msg.idUser;
              }else{
                previousId = '';
              }
              return msg.idUser === userOnline.id ? (
                <div key={msg.id} className=' text-right'>
                  <div className='inline-block bg-[rgb(89,111,50)] text-white rounded-[10px] px-[10px] py-[5px]'>{msg.detail}</div>
                </div>
              ) : (
                <div className='flex' key={msg.id}>
                  {showAvatar && <img className='rounded-[50%] h-[20px] w-[20px] mr-2' src={msg.avatar} alt="" />}
                  <div style={{marginLeft:showAvatar?'':'30px'}} className='bg-[rgb(255,183,178)] text-white rounded-[10px] px-[10px] py-[5px] text-left'>
                    {msg.detail}
                  </div>
                </div>
              );
            })}
          </div>
        );
      });
    };
    //handle Change input
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
      setMessage(e.target.value);
    }
    //send message
    const handleClickSendMsg=async()=>{ 
      setMessage(''); // Xóa trắng input    
      try {
        
        const docRef = await addDoc(collection(db, "messages"), {
            created:serverTimestamp(),
            idRoom:idRoom,
            idUser:userOnline.id,
            username:userOnline.username,
            avatar:userOnline.avatar,
            detail:message,
        });
        //cập nhập trường newTime của room với thời gian hiện tại
         // Cập nhật trường newTime của room với thời gian hiện tại
        await updateDoc(doc(db, 'chats', idRoom), {
          newTime: serverTimestamp(),
          hasMessage: true,
        });
      } catch (e) {
          console.error("Error adding document: ", e);
      }
    }
    //khi người dùng nhấn phím enter thì gửi tin nhắn
    const handleKeyDown=(e:React.KeyboardEvent<HTMLInputElement>)=>{
      if(e.key==='Enter'){
        handleClickSendMsg();
      }
    }
    //cuộn trang đến tin nhắn mới nhất
    useEffect(()=>{
      messagesEndRef.current?.scrollIntoView(({behavior:'smooth'}))
    },[listMessage])
    //
    const handleEmojiClick=()=>{

    }
  return (
    <div style={{height:'600px'}} className='flex'>
       <title>Box Chat</title>
        <HeaderMessage/>
        {/* section message start */}
        <Messages/>
        {/* section message end */}
       
        {/* section boxchat start */}
        <div className='w-[80%] h-[600px]'>
            <div className='flex items-center gap-[20px] p-[20px]'>
              <img  className='rounded-[50%] w-[50px] h-[50px]' src={friend?.avatar} alt="" />
              <div>{friend?.username}</div>
            </div>
            <hr />
           <div style={{borderBottom:'1px solid rgb(207,204,204)'}} className='h-[400px] overflow-auto p-[50px]'>
           {renderMessages()}
           <div ref={messagesEndRef}/>          
            </div> 
           
           <div className='flex items-center justify-center min-h-[80px]'>
               <div className='relative'>
                <input onKeyDown={handleKeyDown} onChange={handleChange} value={message} type="text" style={{border:'1px solid rgb(207,204,204)'}} className=' w-[400px] rounded-[20px] p-[10px] focus:outline-none pl-[40px] pr-[40px]' placeholder='Nhắn tin ...' />
                <i className="absolute text-[rgb(179,221,209)] hover:text-red-400 left-[15px] top-[13px] text-[20px] fa-solid fa-face-smile cursor-pointer"></i>
                {message&&<i onClick={handleClickSendMsg} className='absolute right-[10px] top-[13px] text-[20px] bx bxs-send'></i>}
                </div>
           </div>
        </div>
        {/* section box chat end */}
         
    </div>
  )
}
