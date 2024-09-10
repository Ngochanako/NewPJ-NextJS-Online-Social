import { createSlice } from "@reduxjs/toolkit";

const initialLoading=false;
const loadingReducer=createSlice({
    name:'loading',
    initialState:initialLoading,
    reducers:{
        activeLoading:state=>true,
        disableLoading:state=>false
    }
}
)
export const {activeLoading,disableLoading}=loadingReducer.actions;
export default loadingReducer.reducer;