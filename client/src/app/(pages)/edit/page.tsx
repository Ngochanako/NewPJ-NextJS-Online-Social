'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import bcrypt from 'bcryptjs-react'
import { State, User } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { activeModalAvatar } from '@/store/reducers/ModalReducer';
import { setUserLogin } from '@/store/reducers/UserReducer';
import { updateUser } from '@/services/users.service';
import { json } from 'stream/consumers';
import HeaderLeft from '@/layouts/HeaderLeft';
export default function page() {
    const userOnline=useSelector((state:State)=>state.user);
    const router=useRouter();
    const dispatch=useDispatch();
    const [user,setUser]=useState<User>(userOnline);
    const [changePassWord,setChangePassword]=useState<boolean>(false)
    //change Avatar
    const changeAvatar=()=>{
        dispatch(activeModalAvatar({type:"personal",status:true}));
    }


    //handle Change
    const handleChangeBiography=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
         const value=e.target.value;
         setUser({...user,biography:value});
         setNotifyUpdateUser(false)
    }
    const handleChangeGender=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        const value=e.target.value;
        setNotifyUpdateUser(false)
        setUser({...user,gender:value});
        
    }
    const handleChangePrivate=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value=e.target.checked;
        setUser({...user,private:value});
        setNotifyUpdateUser(false)
        
    }
    //update Personal
    const updatePersonal=(e:React.FormEvent)=>{
        e.preventDefault();
        dispatch(setUserLogin(user));
        dispatch(updateUser(user));
        setNotifyUpdateUser(true)
    }
     //Validate Password
  const validatePassword = (password:string) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return re.test(password);
  };
    //change password
    const [valueOldPass,setValueOldPass]=useState<string>('');
    const [valueNewPass,setValueNewPass]=useState<string>('');
    const [valueConfirmPass,setValueConfirmPass]=useState<string>('');
    const [notifyChangePass,setNotifyChangePass]=useState<boolean>(false);
    const [notifyUpdateUser,setNotifyUpdateUser]=useState<boolean>(false);
    const openChangePassword=()=>{
        setChangePassword(!changePassWord);
        setNotifyChangePass(false);
    }
    const handleOldPassword=(e:React.ChangeEvent<HTMLInputElement>)=>{
        
        setValueOldPass(e.target.value)
    }
    const handleNewPassword=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setValueNewPass(e.target.value)
    }
    const handleConfirmPassword=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setValueConfirmPass(e.target.value)
    }
    const changePassWordUser=(e:React.FormEvent)=>{
        e.preventDefault()
       if(!bcrypt.compareSync(valueOldPass,userOnline.password)){
        return;
       }
       if(!validatePassword(valueNewPass)){
        return;
       }
       if(valueNewPass!==valueConfirmPass){
        return;
       }
       const newUser={
        ...userOnline,password:bcrypt.hashSync(valueNewPass,10)
       }
       setValueConfirmPass('');
       setValueNewPass('');
       setValueOldPass('')
       dispatch(setUserLogin(newUser));
       localStorage.setItem('user',JSON.stringify(newUser));
       dispatch(updateUser(newUser));
       setChangePassword(false);
       setNotifyChangePass(true);
    }
  return (
    <>
    <title>Edit</title>
    <HeaderLeft/>
    <div className='py-[50px] flex flex-col gap-[50px] px-[100px] ml-[230px]'>
      <header className='flex items-center justify-between py-[20px] px-[50px] bg-[rgb(239,239,239)] rounded-[20px]'>
        <div className='flex items-center gap-[10px]'>
             <img className='w-[80px] h-[80px] rounded-[50%]' src={userOnline?.avatar} alt="" /> 
            <div className='font-bold'>{userOnline?.username}</div>
        </div>
        <button onClick={changeAvatar} className='bg-[rgb(0,149,246)] hover:bg-[rgb(0,149,246,0.8)] text-white text-[16px] p-[10px] rounded-[5px]'>Đổi ảnh đại diện</button>
      </header>
      {/* Change Password */}
      <div>
        <div onClick={openChangePassword} className='rounded-[5px] bg-orange-400 text-white p-[10px] w-[150px] hover:bg-orange-300 cursor-pointer'>Đổi mật khẩu</div>
        {changePassWord&&<form action="" className='flex flex-col gap-[10px] text-[14px] mt-[20px] w-[400px]'>
            <input onChange={handleOldPassword} type="password"  className='p-[5px]' placeholder='Nhập mật khẩu cũ' value={valueOldPass}/>
            {!bcrypt.compareSync(valueOldPass,userOnline.password)&&<div className='text-[14px] text-red-500'>Mật khẩu chưa chính xác</div>}
            <input onChange={handleNewPassword} type="password"  className='p-[5px]' placeholder='Nhập mật khẩu mới' value={valueNewPass}/>
            {!validatePassword(valueNewPass)&&<div className='text-[14px] text-red-500'>Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number</div>}
            <input onChange={handleConfirmPassword} type="password"  className='p-[5px]' placeholder='Nhập lại mật khẩu mới' value={valueConfirmPass}/>
            {valueNewPass!==valueConfirmPass&&<div className='text-[14px] text-red-500'>Mật khẩu chưa trùng khớp</div>}
            <button onClick={changePassWordUser} className='bg-[rgb(0,149,246)] text-white text-[16px] p-[10px] rounded-[5px] w-[200px] hover:bg-[rgb(0,149,246,0.8)]'>Gửi</button>
        </form>}
        {notifyChangePass&&<p className='text mt-[20px]'>Bạn đã đổi mật khẩu thành công </p>}
      </div>
      {/* Change detail user */}
      <form action="" className='flex flex-col gap-[50px]'>
      <div className='flex flex-col gap-[20px]'>
         <p className='font-bold'>Tiểu sử</p>
         <textarea onChange={handleChangeBiography} value={user?.biography} name="biography" id="" maxLength={150} className='text-[14px] placeholder:italic placeholder:text-slate-400 block w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm w-[80%] max-h-[100px] resize-none' placeholder='Thêm tiểu sử'></textarea>
      </div>
      <div className='flex flex-col gap-[20px]'>
         <p className='font-bold'>Giới tính</p>
         <select onChange={handleChangeGender} name="gender" id="" className='p-[10px] focus:border-gray-600 outline-none' value={user?.gender}>
            <option value="">Không muốn tiết lộ</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
         </select>
      </div>
     
      <div className='flex flex-col gap-[20px]'>
         <p className='font-bold'>Quyền riêng tư của tài khoản</p>
         <div className='flex justify-between'>
            <p className='text-gray-600'>Tài khoản riêng tư</p>
            <input onChange={handleChangePrivate} type="checkbox" name='private' checked={user?.private}/>
         </div>
         <p className='text-[14px] text-gray-600'>Khi bạn đặt tài khoản ở chế độ công khai, bất cứ ai trên Instagram cũng có thể xem trang cá nhân và bài viết của bạn, ngay cả khi họ không có tài khoản Instagram.
         Khi bạn đặt tài khoản ở chế độ riêng tư, chỉ những người theo dõi có thể xem nội dung mà bạn chia sẻ – bao gồm ảnh hoặc video trên trang.</p>
      </div>
      {notifyUpdateUser&&<div className='text'>Bạn đã cập nhập thành công</div>}
      <button onClick={updatePersonal} className='bg-[rgb(0,149,246)] text-white text-[16px] p-[10px] rounded-[5px] w-[200px] hover:bg-[rgb(0,149,246,0.8)]'>Gửi</button>
      </form>
    </div>
    </>
  )
}
