'use client'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import bcrypt from 'bcryptjs-react';
import { State, User } from '@/interfaces';
import { useRouter } from 'next/navigation';
import { getUsers, registerUser } from '@/services/users.service';
import { useEffect, useState } from 'react';
import { setRegister } from '@/store/reducers/UserReducer';
import style from '@/styles/signup.module.css'
export default function Page() {
  const router = useRouter();  // Sử dụng useRouter
  const users: User[] = useSelector((state: State) => state.register);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [errorUsername, setErrorUsername] = useState<string>('');
  const [user, setUserRegister] = useState<User>({
    id: '',
    username: '',
    password: '',
    email: '',
    avatar: '',
    biography: '',
    gender: '',
    followUsersById: [],
    status: true,
    private: false,
    requestFollowById: []
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return re.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrorEmail('Incorrect Email Format');
      } else {
        axios.get(`http://localhost:3000/users?email=${value}`)
          .then(response => {
            if (response.data.length > 0) {
              setErrorEmail('Email has already registered');
            } else {
              setErrorEmail('');
            }
          })
          .catch(err => console.log(err));
      }
    }

    if (name === 'username') {
      axios.get(`http://localhost:3000/users?username=${value}`)
        .then(response => {
          if (response.data.length > 0) {
            setErrorUsername('Username has already registered');
          } else {
            setErrorUsername('');
          }
        })
        .catch(err => console.log(err));
    }

    if (name === 'password') {
      if (!validatePassword(value)) {
        setErrorPassword('Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number');
        return;
      }
      setErrorPassword('');
    }

    setUserRegister({ ...user, [name]: value });
  }

  const register = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user.email) {
      setErrorEmail('Email is required');
      return;
    }
    if (!user.username) {
      setErrorUsername('Username is required');
      return;
    }
    if (!user.password) {
      setErrorPassword('Password is required');
      return;
    }

    let cryptPassword = bcrypt.hashSync(user.password, 10);
    const newUser: User = { ...user, id: uuidv4(), avatar: 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg', password: cryptPassword };
    const register:User={
      id: '',
      username: '',
      password: '',
      email: user.email,
      avatar: '',
      biography: '',
      gender: '',
      followUsersById: [],
      status: true,
      private: false,
      requestFollowById: []
    }
    console.log(register)
    dispatch(setRegister(register));
    dispatch(registerUser(newUser));
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  }

  return (
    <div className= {`${style.register} flex items-center justify-center`}>
      <div className='w-[350px] border-gray-300 h-[600px] border-solid border-1 p-[30px] flex flex-col gap-[20px] mt-[10px]'>
        <p className='text-[rgb(115,115,115)] font-[600] text-center'>Sign up to see photos and videos from your friends</p>
        <Button className='bg-[rgb(0,149,246)] border-transparent rounded-[5px] p-[10px] text-white' variant="primary">Login with Facebook</Button>
        <div className={style.registerhr}>
          <div className={style.hr}></div>
          <div className='text-[rgb(115,115,115)] font-[600]'>OR</div>
          <div className={style.hr}></div>
        </div>
        <form action="" className='flex flex-col gap-[10px]'>
          <input className={style.input} onChange={handleChange} name='email' type="email" placeholder='Email' />
          <Form.Text className="text-muted">
            <span className='text-red-500'> {errorEmail}</span>
          </Form.Text>
          <input className={style.input} onChange={handleChange} name='username' type="text" placeholder='Username' />
          <Form.Text className="text-muted">
            <span className='text-red-500'> {errorUsername}</span>
          </Form.Text>
          <input className={style.input} onChange={handleChange} name='password' type='password' placeholder='Password' />
          <Form.Text className="text-muted">
            <span className='text-red-500'> {errorPassword}</span>
          </Form.Text>
          <p className={style.textRegister}>People who use our service may have uploaded your contact information to Instagram. Learn More</p>
          <p className={style.textRegister}>By signing up, you agree to our Terms, Privacy Policy, and Cookies Policy.</p>
          <Button onClick={register} className='bg-[rgb(0,149,246)] border-transparent rounded-[5px] p-[10px] text-white' variant="primary">Sign up</Button>
        </form>
        <p className='text-gray-700 font-[500] text-center'>Have an account? <span><a className='text-blue-500' href="/login">Login</a></span></p>
      </div>
    </div>
  );
}
