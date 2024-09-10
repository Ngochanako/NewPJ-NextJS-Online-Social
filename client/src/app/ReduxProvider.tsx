// components/ReduxProvider.tsx
'use client';  // Đánh dấu đây là Client Component

import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { setUserLogin } from '@/store/reducers/UserReducer';
import { useRouter } from 'next/navigation';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const router=useRouter();
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    const savedAdmin = JSON.parse(localStorage.getItem("admin") || "null");
    if (savedUser&&savedUser.status) {
      store.dispatch(setUserLogin(savedUser));
    }else{
      router.push('/login');
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
