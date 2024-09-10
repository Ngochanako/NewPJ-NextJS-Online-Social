import { createSlice } from "@reduxjs/toolkit";
import { CommentChild } from "../../interfaces";
import { addNewCommentChild, getCommentsChild } from "../../services/commentsChild.service";
let initialCommentsChild:CommentChild[]=[];
export const commentsChildReducer=createSlice({
    name:"commentsParent",
    initialState:initialCommentsChild,
    reducers:{},
    extraReducers(builder) {
        builder
        .addCase(addNewCommentChild.fulfilled,(state,action)=>{
            state.push(action.payload);
        })
        .addCase(getCommentsChild.fulfilled,(state,action)=>{
            return action.payload;
        })
    },
})
export default commentsChildReducer.reducer;