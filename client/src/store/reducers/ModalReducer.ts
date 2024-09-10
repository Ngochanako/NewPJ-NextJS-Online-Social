import { createSlice } from "@reduxjs/toolkit";
import { Modal } from "../../interfaces";

const initialModal:Modal={
    comments:false,
    avatar:{
        type:'',
        status:false,
    },
    post:{
        type:'',
        status:false,
    },
    uploadPost:{
        type:'',
        status:false
    },
    updatePost:false,
    delete:false,
    editPost:false,
    detailUser:false,
};
const modalReducer=createSlice({
    name:"modal",
    initialState:initialModal,
    reducers:{
        activeModalAllComment:(state)=>{          
            state.comments=true;
        },
        disableModalAllComment:(state)=>{
            state.comments=false;
        },
        activeModalAvatar:(state,action)=>{
            state.avatar=action.payload           
        },
        disableModalAvatar:(state,action)=>{
            state.avatar= action.payload
        },
        activeModalPost:(state,action)=>{
            state.post=action.payload;
        },
        disableModalPost:(state,action)=>{           
            state.post=action.payload;
        },
        activeModalUploadPost:(state,action)=>{
            state.uploadPost= action.payload
        },
        disableModalUploadPost:(state,action)=>{
            state.uploadPost= action.payload
        },
        activeModalUpdatePost:(state)=>{
            state.updatePost=true;
        },
        disableModalUpdatePost:(state)=>{
            state.updatePost=false;
        },
        activeModalDelete:(state)=>{
            state.delete=true;
        },
        disableModalDelete:(state)=>{
            state.delete=false;
        },
        activeModalEditPost:(state)=>{
            state.editPost=true;
        },
        disableModalEditPost:(state)=>{
            state.editPost=false;
        },
        activeModalDetailUser:(state)=>{
            state.detailUser=true;
        },
        disableModalDetailUser:(state)=>{
            state.detailUser=false;
        }
    }
})
export const{activeModalAllComment,disableModalAllComment,activeModalAvatar,disableModalAvatar,activeModalPost,disableModalPost,activeModalUploadPost,disableModalUploadPost,activeModalUpdatePost,disableModalUpdatePost,activeModalDelete,disableModalDelete,activeModalEditPost,disableModalEditPost,activeModalDetailUser,disableModalDetailUser}=modalReducer.actions;
export default modalReducer.reducer;
