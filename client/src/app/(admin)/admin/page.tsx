'use client'
import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import NavAdmin from '../layouts/NavAdmin';
import HeaderAdmin from '../layouts/HeaderAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { State, User } from '@/interfaces';
import { getUsers, updateUser } from '@/services/users.service';
import styles from '@/styles/pagination.module.css'
import axios from 'axios';
import classNames from 'classnames';
import { activeModalDetailUser } from '@/store/reducers/ModalReducer';
export default function page() {
  const router=useRouter();
  const dispatch=useDispatch();
  const [widthHeaderLeft,setWithHeaderLeft]=useState<string>('200px');
  const [hiddenHeader,setHiddenHeader]=useState<boolean>(true);
  const [valueSearch,setValueSearch]=useState<string>('');
  const userOnline=useSelector((state:State)=>state.user);
  const [users,setUsers]=useState<User[]>([]);
  const [currentPage,setCurrentPage]=useState<number>(1);
  const [search,setSearch]=useState<string>('');
  const [usersByTotal,setUsersByTotal]=useState<User[]>([]);
  const [totalPage,setTotalPage]=useState<number>(0);
  const usersAPI=useSelector((state:State)=>state.users)
  // authorize access to page
  useEffect(()=>{
    dispatch(getUsers());
    const admin=JSON.parse(localStorage.getItem('admin')||'null');
    if(!admin){
      router.push('/login');
    }
  },[])
  
  //handle Mouse header-left
  const handleMouseHeaderLeft=()=>{
      setWithHeaderLeft(widthHeaderLeft=='80px'?'200px':'80px');
      setHiddenHeader(hiddenHeader?false:true);
  } 
  //log out
  const logout=()=>{
     localStorage.removeItem('admin');
     router.push('/login');
  }
  //search User
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setValueSearch(e.target.value.toLowerCase().trim());
  }
  const searchUser=()=>{
     setSearch(valueSearch);
     setValueSearch('');
  }
  //lock user
  const handleLockUser=(user:User)=>{
    let newUser={
      ...user,
      status:!user.status
    }
      dispatch(updateUser(newUser));
  }
  //pagination
  useEffect(()=>{
    axios.get(`http://localhost:3000/users?username_like=${search}`)
    .then(response=>{
        setUsersByTotal(response.data)
        setTotalPage(Math.ceil(response.data.length/2));
    })
    .catch(err=>console.log(err))
},[search])
useEffect(()=>{
    axios
    .get(`http://localhost:3000/users?_page=${currentPage}&_limit=2&username_like=${search}`)
    .then((response) => {
      console.log('Data received:', response.data); // Log dữ liệu để kiểm tra
      setUsers(response.data);
    })
    .catch((err) => console.log(err));
},[currentPage,search])
//handle page change
const handlePageChange =(page:number)=>{
    setCurrentPage(page);
}
//back previous page
const handlePrev=()=>{
    setCurrentPage(currentPage-1);
}
//next to page last
const handlePageLast=()=>{
    setCurrentPage(totalPage);
}
//back to page first
const handlePageFirst=()=>{
    setCurrentPage(1);
}
//next page
const handleNext=()=>{
    setCurrentPage(currentPage+1);
}
//render pages
const renderPagesNumber=()=>{
    const pages=[];
    let a:number=2;
    let b:number=0;
    if(totalPage<4){
       b=totalPage-1
    }else{
        if(currentPage<4){
            b=4
        }else if(currentPage>totalPage-3){
            a=totalPage-3;
            b=totalPage-1;
        }else{
            a=currentPage-1;
            b=currentPage+1;
        }
    }
    
    for(let i=a;i<=b;i++){
        pages.push(
            <button onClick={()=>handlePageChange(i)} 
            className={classNames(styles.pagesNumber,{
                [styles.active]:i==currentPage,
            })}>
                {i}
            </button>
        )
    }
    return pages;
}

  return (
    <div className=''>
      {/* Bắt đầu nav */}
        <NavAdmin/>
        {/* Kết thúc nav */}

       <div className='flex'>
          {/* Start Header-Left */}
          <HeaderAdmin/>
          {/* Header-left end */}
          {/* Main start */}
          <main className='flex flex-col w-[100%]'>
        {/* {modal&&<ModalDetailUser user={user}/>} */}
            {/* Header-Main Start */}
            <div className='flex justify-around items-center p-[20px]'>
            
              <div className=' flex gap-[20px] items-center'>
              </div>
              <div className='relative'>
                  <input onChange={handleChange} type="text" placeholder='Search user' className='p-1 focus:outline-none' value={valueSearch}/>
                  <i onClick={searchUser} className='bx bx-search absolute right-0 top-1 bx-sm cursor-pointer'></i>
              </div>
            </div>
            {/* Header-Main End */}
            {/* Article Start */}
            <article className='py-[20px] px-[50px] bg-zinc-200'>
                <section className='flex justify-around'>
                   <div className='flex items-center bg-white py-2 px-[80px] gap-1 rounded-lg'>
                   <i className='bx bxs-user bx-sm text-lime-700'></i>
                   <div>
                    <p className='text-lg font-bold '>Total Users</p>
                    <p className='text-orange-500'> {usersAPI.length} users</p>
                   </div>
                   </div>
                   <div className='flex items-center bg-white py-2 px-[80px] gap-1 rounded-lg'>
                   <img className='w-[20px] h-[20px] rounded-[50%]' src={userOnline?.avatar} alt="" />
                   
                   <div>
                    <p className='text-lg font-bold '>Top Followers</p>
                    <p className='flex'> {userOnline?.username}</p>
                   </div>
                   </div>
                </section>
                {/* Calculate End */}
                {/* Content Start */}
                <section className='bg-white rounded-lg p-[20px] mt-[50px] flex flex-col gap-2'>
                   <p className='text-lg font-bold'>List users</p>
                   <p className='text'><i className='bx bxs-alarm-exclamation'></i>There are {usersByTotal.length} users to be found </p>
                   <br />
                   <Table striped bordered hover className='rounded-[5px]'>
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Avatar</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Activities</th>
                      </tr>
                    </thead>
                    <tbody>
                        {users.map((btn,index)=>(
                           <tr key={index}>
                           <td>{index+1}</td>
                           <td className='flex justify-center'><img className='w-[50px] h-[50px] rounded-[50%]' src={btn.avatar} alt="" /></td>
                           <td>{btn.username}</td>
                           <td>{btn.email}</td>
                           <td><Button variant={btn.status?"outline-success":"outline-danger"}>{btn.status?'Active':"Disable"}</Button></td>
                           <td className='cursor-pointer'>
                               {!btn.status?<i onClick={()=>handleLockUser(btn)} className='bx bxs-lock-alt'></i>:<i onClick={()=>handleLockUser(btn)} className='bx bxs-lock-open-alt'></i>}                          
                               {/* <i onClick={()=>viewDetailUser(btn)} className="fa-solid fa-eye ml-[20px]"></i> */}
                           </td>
                         </tr>
                        ))}
                    </tbody>
                  </Table>
                  {/* pagination */}
                  <div className={styles.pagination}>
                    <button onClick={handlePrev} className={styles.navButton} disabled={currentPage==1}>Prev</button>
                    <button
                            onClick={handlePageFirst}
                            className={classNames(styles.pagesNumber, {
                                [styles.active]: currentPage === 1,
                            })}>
                            1
                    </button>
                    <div className={`${currentPage<4?'hidden':''}`}>...</div>
                    {renderPagesNumber()}
                    <div className={`${currentPage>17||totalPage<4?'hidden':''}`}>...</div>
                    <button
                            onClick={handlePageLast}
                            className={classNames(styles.pagesNumber, {
                                [styles.active]: currentPage === totalPage,
                            })}>
                            {totalPage}
                    </button>
                    <button onClick={handleNext} className={styles.navButton} disabled={currentPage==totalPage}>Next</button>
                </div>
                </section>
            </article>
          </main>
        </div> 
    </div>
  )
}
