import { createSlice } from "@reduxjs/toolkit";

const initialPreviewImages:string[]=[];
const previewImagesReducer=createSlice({
    name:'previewImages',
    initialState:initialPreviewImages,
    reducers:{
        setPreviewImages:(state,action)=>{

            return [...action.payload];
        }
    }
})
export const{setPreviewImages}=previewImagesReducer.actions;
export default previewImagesReducer.reducer;