import { User } from "@/interfaces";
import { getUsers, registerUser, updateUser } from "@/services/users.service";
import { createSlice } from "@reduxjs/toolkit";

const initialUser:User[]=[];
const usersReducer=createSlice({
    name:"users",
    initialState:initialUser,
    reducers:{},
    extraReducers(builder){
        builder
        .addCase(getUsers.fulfilled,(state,action)=>{
            return action.payload;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.push(action.payload);
        })
        .addCase(updateUser.fulfilled,(state,action)=>{
            return state.map(item=>item.id===action.payload.id?action.payload:item);
        })
    }
})

export default usersReducer.reducer;