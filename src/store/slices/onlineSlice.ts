import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: {
    users: [], // array of online userIds
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineSlice.actions;
export default onlineSlice.reducer;
