import { createSlice } from "@reduxjs/toolkit";

const initialImagePost:any[]=[];
const imagesPostReducer=createSlice({
    name:'user/imagesPost',
    initialState:initialImagePost,
    reducers:{
        setImagesPost:(state,action)=>{
            return action.payload;
        }
    }
})
export const {setImagesPost}=imagesPostReducer.actions;
export default imagesPostReducer.reducer;