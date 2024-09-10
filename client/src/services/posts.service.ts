import { Post } from "@/interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addNewPost:any=createAsyncThunk(
    "posts/addNewPost",
    async (post:Post)=>{
        const response=await axios.post("http://localhost:3000/posts",post);
        return response.data;
    }
)
export const getPosts:any=createAsyncThunk(
    'posts/getPosts',
    async()=>{
        const response=await axios.get("http://localhost:3000/posts");
        return response.data;
    }
)
export const updatePost:any=createAsyncThunk(
    'posts/updatePost',
    async(post:Post)=>{
        const response=await axios.put(`http://localhost:3000/posts/${post.id}`,post);
        return response.data;
    }
)
export const deletePost:any=createAsyncThunk(
    'posts/deletePost',
    async(id:string)=>{
        const response=await axios.delete(`http://localhost:3000/posts/${id}`);
        return id;
    }
)