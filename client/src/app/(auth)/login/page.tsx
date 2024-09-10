'use client'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import style from '@/styles/signup.module.css'
import bcrypt from 'bcryptjs-react'
import { useRouter } from 'next/navigation';
import { State, User } from '@/interfaces';
import Link from 'next/link';
import { setUserLogin } from '@/store/reducers/UserReducer';
export default function Login() {
  //Initiliazation
   const dispatch=useDispatch();
   const router=useRouter();
   const register=useSelector((state:State)=>state.user)
   const [user,setUser]=useState<User>(register);
   console.log(register)
   const [error,setError]=useState<string>('');
   const [hidePass,setHidePass]=useState<string>('password')
   //handle Change Input
   const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
     const {name,value}=e.target;
     setUser({...user,[name]:value});
   }
   //login
   const login=(e:React.FormEvent)=>{
      e.preventDefault();
      if(user.email==='admin@gmail.com'){
        axios.get("http://localhost:3000/users?email=admin@gmail.com")
        .then((response)=>{
          if(response.data.length>0){
            //password is "Abc123"
            let decryptpassword:boolean=bcrypt.compareSync(user.password,response.data[0].password);
            console.log(decryptpassword)
            if(decryptpassword){
                localStorage.setItem('admin',JSON.stringify(user));
                console.log(1)
                router.push('/admin');              
            } 
          }
        })
        .catch(err=>console.log(err));
        return;
      }     
      axios.get(`http://localhost:3000/users?email=${user.email}`)
      .then((response)=>{ 
   
        if(response.data.length>0){  
          if(response.data[0].status==true){
            let decryptpassword:boolean =  bcrypt.compareSync(user.password,response.data[0].password)
            if(decryptpassword){
                localStorage.setItem('user',JSON.stringify(response.data[0]));
              dispatch(setUserLogin(response.data[0]));              
                router.push('/home');
            }else{
              setError('Password or Email is incorrect')
            }            
          }else{
            setError('Email has been locked')
          }                     
          }else{
            setError('Email has not been registered')
          }
      })
      .catch( err=>console.log(err))
   }
   //hide Password
   const handleHidePass=()=>{
      setHidePass(hidePass=='password'?'text':'password')
   }
  return (
    <div className='flex items-center justify-center text-[14px]'>
      <div className='w-[350px] border-gray-300 h-[400px] border-solid border-1 p-[50px] flex flex-col gap-[20px] mt-[20px]'>
        <form action="" className='flex flex-col gap-[10px]'>
            <input className={style.input} required onChange={handleChange} name='email' type="email" placeholder='Email' value={user?.email} />
            
            <input className={style.input} required onChange={handleChange} name='password' type={hidePass} placeholder='Password'/>
            <i onClick={handleHidePass} className="fa-solid fa-eye-slash absolute top-[135px] right-[520px] cursor-pointer"></i>
            <Form.Text className="text-muted">
                  <span className='text-red-500'> {error}</span>
            </Form.Text>
            <Button onClick={login} className='bg-[rgb(0,149,246)] border-transparent rounded-[5px] p-[10px] text-white' variant="primary">Log in </Button>
        </form>
        <div className={style.registerhr}>
            <div className={style.hr} ></div>
            <div className='text-[rgb(115,115,115)] font-[600]'>OR</div>
            <div className={style.hr}></div>
        </div>
        <div className='flex flex-col items-center gap-[10px]'>
            <div className='flex items-center gap-[10px] text-[rgb(56,81,133)]'>
                <i className="fa-brands fa-facebook"></i>
                <div>Login with Facebook</div>
            </div>
            <div className='text-blue-700'>Forgot Password?</div>
        </div>
        <p className='text-gray-700 font-[500] text-center'>Don't have an account? <Link href={'/signup'}><span className='text-blue-500 font-bold'>Sign up</span></Link></p>
      </div>
    </div>
  )
}
