import { createSlice } from "@reduxjs/toolkit";
import { CommentParent } from "../../interfaces";
import { addNewCommentParent, getCommentsParent, updateCommentsParent } from "../../services/commentsParent.service";

let initialCommentsParent:CommentParent[]=[];
export const commentsParentReducer=createSlice({
    name:"commentsParent",
    initialState:initialCommentsParent,
    reducers:{},
    extraReducers(builder) {
        builder
        .addCase(addNewCommentParent.fulfilled,(state,action)=>{
            state.push(action.payload);
        })
        .addCase(getCommentsParent.fulfilled,(state,action)=>{
            return action.payload;
        })
        .addCase(updateCommentsParent.fulfilled,(state,action)=>{
            return state.map(btn=>btn.id==action.payload.id?action.payload:btn);
        })
    },
})
export default commentsParentReducer.reducer;