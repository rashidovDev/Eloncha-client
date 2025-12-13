import { configureStore } from "@reduxjs/toolkit";
import { Store } from "redux"
import toggleSlice from "./slices/toggleSlice";
import loaderSlice from "./slices/loaderSlice";
import userSlice from "./slices/userSlice"
import chatSlice from "./slices/chatSlice"
import onlineSlice from "./slices/onlineSlice"

export const store : Store = configureStore({
    reducer : {
        toggle : toggleSlice,
        loader : loaderSlice,
        user : userSlice,
         chat: chatSlice,
         online: onlineSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


