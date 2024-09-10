import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CommentParent } from "../interfaces";

export const addNewCommentParent:any=createAsyncThunk(
    "comments/addNewCommentParent",
    async(comment:CommentParent)=>{
        const response= await axios.post("http://localhost:3000/commentsParent",comment);
        return response.data;
    }
)
export const getCommentsParent:any=createAsyncThunk(
    "comments/getCommentsParent",
    async()=>{
        const response=await axios.get("http://localhost:3000/commentsParent");
        return response.data;
    }
)
export const updateCommentsParent:any=createAsyncThunk(
    "comments/updateCommentsParent",
    async(comment:CommentParent)=>{
        const response=await axios.put(`http://localhost:3000/commentsParent/${comment.id}`,comment);
        return response.data;
    }
)