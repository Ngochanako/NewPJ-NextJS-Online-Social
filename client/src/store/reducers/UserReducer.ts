import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../../interfaces";
import { log } from "console";

const initialUser:User|null=null;
const userReducer=createSlice({
    name:'user',
    initialState:initialUser,
    reducers:{
        setRegister:(state,action)=>{
            return action.payload;
        },
        setUserLogin:(state,action)=>{
            return action.payload;
        },
        logoutUser:(state)=>{
            return null;
        }
    }
})
export const {setRegister,setUserLogin,logoutUser}=userReducer.actions;
export default userReducer.reducer;