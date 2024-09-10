import { Post } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialPost:Post={
    id:'',
    idUser:'',
    avatarUser:'',
    userNameUser:'',
    detail:'',
    date:0,
    fullDate:'',
    images:[],
    commentsById:[],
    favouristUsersById:[], 
    idGroup:null,
    status:'',
    lock:false,
}
const postReducer=createSlice({
    name:"post",
    initialState:initialPost,
    reducers:{
        setPost:(state,action)=>{
            return action.payload;
        },
        resetPost:(state)=>initialPost
    }
    
})
export const {setPost,resetPost}=postReducer.actions;
export default postReducer.reducer;