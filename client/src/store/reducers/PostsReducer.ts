import { Post } from "@/interfaces";
import { addNewPost, deletePost, getPosts, updatePost } from "@/services/posts.service";
import { createSlice } from "@reduxjs/toolkit";


const initialPosts:Post[]=[];
const postsReducer=createSlice({
    name:'posts',
    initialState:initialPosts,
    reducers:{},
    extraReducers(builder){
        builder 
        .addCase(getPosts.fulfilled,(state,action)=>{
             return action.payload;
        })
        .addCase(addNewPost.fulfilled,(state,action)=>{
             state.push(action.payload);
        })
        .addCase(updatePost.fulfilled,(state,action)=>{
            return state.map(btn=>btn.id==action.payload.id?action.payload:btn);
        })
        .addCase(deletePost.fulfilled,(state,action)=>{
            return state.filter(btn=>btn.id!=action.payload);
        })
    }
})
export default postsReducer.reducer;