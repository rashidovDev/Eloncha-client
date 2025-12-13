import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/types";

interface LoaderState {
    user : User | {} | null,
    isAuth : boolean,
    profile : boolean
}

const initialState : LoaderState = {
    user : {}, //User data
    isAuth : false,
    profile : false
}
const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        logoutAdminUser : function(state){
            state.user = null;
            state.isAuth = false
            localStorage.removeItem("admin_access_token")
            localStorage.removeItem("admin_user")
            localStorage.removeItem("admin_tokenTime")
        },
        logoutUser : function(state){
            state.user = null;
            state.isAuth = false;
            localStorage.removeItem("user_access_token")
            localStorage.removeItem("user")
            localStorage.removeItem("user_tokenTime")
        },
        showProfile : function(state){
            state.profile = !state.profile
        },
        hideProfile : function(state){
            state.profile = false
        }
    }
})

export const {logoutAdminUser, logoutUser, showProfile, hideProfile} = userSlice.actions;
export default userSlice.reducer;