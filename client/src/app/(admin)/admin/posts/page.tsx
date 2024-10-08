'use client'
import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import NavAdmin from '../../layouts/NavAdmin';
import HeaderAdmin from '../../layouts/HeaderAdmin';
import { Post, State } from '@/interfaces';
import { getPosts, updatePost } from '@/services/posts.service';
import axios from 'axios';
import classNames from 'classnames';
import styles from '@/styles/pagination.module.css'
import Image from 'next/image';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function page() {
  //Initialize
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Post[]>([]);
  const postsAPI=useSelector((state:State)=>state.posts);
  const [currentPage,setCurrentPage] =useState<number>(1);
  const [totalPage,setTotalPage] = useState<number>(0);
  //get data
  useEffect(()=>{
    dispatch(getPosts());
  },[])
  //get total page
  useEffect(()=>{
    setTotalPage(Math.ceil(postsAPI.length/2))
  },[postsAPI])
  //handle lock post
  const handleLockPost=(post:Post)=>{
    const newPost={
      ...post,
      lock:!post.lock
    }
    dispatch(updatePost(newPost));
    if(newPost.lock){
      const newNotify=async()=>{
        try {
           const docREf=await addDoc(collection(db,'notifications'),{
            detail:'Bài viết của bạn vừa bị khóa',
            url:`/home?id=${newPost.id}`,
            idUser:post.idUser,
            status:false,
            created:serverTimestamp(),
            idUserSendNotify:''
           }) 
        } catch (error) {
            console.log(error);                  
        }
    }
    newNotify();
    }else{
      const newNotify=async()=>{
        try {
           const docREf=await addDoc(collection(db,'notifications'),{
            detail:'Bài viết của bạn vừa được mở khóa',
            url:`/home?id=${newPost.id}`,
            idUser:post.idUser,
            status:false,
            created:serverTimestamp(),
            idUserSendNotify:''
           }) 
        } catch (error) {
            console.log(error);                  
        }
      }
      newNotify();
    }
  }
   //pagination
useEffect(()=>{
    axios
    .get(`http://localhost:3000/posts?_page=${currentPage}&_limit=2`)
    .then((response) => {
      setPosts(response.data);
    })
    .catch((err) => console.log(err));
},[currentPage,postsAPI])
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
    let pages=[];
    let a:number=2;
    let b:number=0;
    if(totalPage<=4){
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
      <title>Manage Posts</title>
      {/* Bắt đầu nav */}
        <NavAdmin/>
        {/* Kết thúc nav */}

       <div className='flex'>
          {/* Start Header-Left */}
          <HeaderAdmin/>
          {/* Header-left end */}
          {/* Main start */}
          <main className='flex flex-col w-[100%]'>
            <article className='py-[20px] px-[50px] bg-zinc-200'>
                {/* Content Start */}
                <section className='bg-white rounded-lg p-[20px] mt-[20px] flex flex-col gap-2'>
                   <p className='text-lg font-bold'>List posts</p>
                   <p className='text'><i className='bx bxs-alarm-exclamation'></i>There are {postsAPI.length} posts to be found </p>
                   <br />
                   <Table striped bordered hover className='rounded-[5px]'>
                    <thead>
                      <tr>
                        <th>Index</th>
                        <th>Detail</th>
                        <th>Image</th>
                        <th>Create_at</th>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Activities</th>
                      </tr>
                    </thead>
                    <tbody>
                        {posts.map((btn,index)=>(
                           <tr key={index}>
                           <td>{index+1}</td>
                           <td>{btn.detail}</td>
                           <td>

                            <Image 
                              src={btn.images && btn.images.length > 0 ? btn.images[0] : '/default-image.jpg'} 
                              alt="Post Image" 
                              width={50} 
                              height={50}
                            />

                           </td>
                           <td>{btn.fullDate}</td>
                           <td>{btn.userNameUser}</td>
                           
                           <td><Button variant={!btn.lock?"outline-success":"outline-danger"}>{!btn.lock?'Active':"Disable"}</Button></td>
                           <td className='cursor-pointer'>
                               {btn.lock?<i onClick={()=>handleLockPost(btn)} className='bx bxs-lock-alt'></i>:<i onClick={()=>handleLockPost(btn)} className='bx bxs-lock-open-alt'></i>}                          
                           </td>
                         </tr>
                        ))}
                    </tbody>
                  </Table>
                  {/* Pagination */}
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
                    <div className={`${currentPage>totalPage-3||totalPage<=4?'hidden':''}`}>...</div>
                    <button
                            onClick={handlePageLast}
                            className={classNames(styles.pagesNumber, {
                                [styles.active]: currentPage === totalPage,
                                [styles.hidden]: totalPage==1
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

