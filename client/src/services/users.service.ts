import { User } from "@/interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser:any=createAsyncThunk(
    "users/register",
    async(user:User)=>{
        const response=await axios.post("http://localhost:3000/users",user);
        return response.data;
    }
)
export const getUsers:any=createAsyncThunk(
    "users/getUsers",
    async()=>{
        const response=await axios.get("http://localhost:3000/users");
        return response.data;
    }
)
export const updateUser:any=createAsyncThunk(
    "users/updateUser",
    async(user:User)=>{
        const response=await axios.put(`http://localhost:3000/users/${user.id}`,user);
        return response.data;
    }
)