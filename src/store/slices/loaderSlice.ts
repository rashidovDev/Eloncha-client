import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
    loader : boolean
}

const initialState : LoaderState = {
    loader : false
}

const loaderSlice = createSlice({
    name : 'loader',
    initialState,
    reducers : {
        showLoader : function(state){
            state.loader = true
        }, 
        hideLoader : function(state){
            state.loader = false
        }
    }
})

export default loaderSlice.reducer
export const {showLoader, hideLoader} = loaderSlice.actions



