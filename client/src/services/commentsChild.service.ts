import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CommentChild } from "../interfaces";

export const addNewCommentChild:any=createAsyncThunk(
    "comments/addNewCommentParent",
    async(comment:CommentChild)=>{
        const response= await axios.post("http://localhost:3000/commentsChild",comment);
        return response.data;
    }
)
export const getCommentsChild:any=createAsyncThunk(
    "comments/getCommentsChild",
    async()=>{
        const response=await axios.get("http://localhost:3000/commentsChild");
        return response.data;
    }
)