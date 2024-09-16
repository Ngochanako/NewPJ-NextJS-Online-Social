// components/ReduxProvider.tsx
'use client';  // Đánh dấu đây là Client Component

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { setUserLogin } from '@/store/reducers/UserReducer';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { State } from '@/interfaces';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  // const router=useRouter();
  // useEffect(() => {
  //   const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  //   const savedAdmin = JSON.parse(localStorage.getItem("admin") || "null");
  //   if (savedUser&&savedUser.status) {
  //     axios.get(`http://localhost:3000/users/${savedUser.id}`)
  //     .then(res=>{
  //       store.dispatch(setUserLogin(res.data))
  //     }
  //     )    
  //   }
  // }, []);

  return <Provider store={store}>{children}</Provider>;
}
