import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  currentChat: any | null;
  unreadTotal: number;
}

const initialState: ChatState = {
  currentChat: null,
  unreadTotal: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat: (state, action: PayloadAction<any>) => {
      state.currentChat = action.payload;
    },
    closeChat: (state) => {
      state.currentChat = null;
    },
    setUnreadTotal: (state, action: PayloadAction<number>) => {
      state.unreadTotal = action.payload;
    },
    adjustUnread: (state, action: PayloadAction<number>) => {
      state.unreadTotal = Math.max(0, state.unreadTotal + action.payload);
    },
  },
});

export const { openChat, closeChat, setUnreadTotal, adjustUnread } = chatSlice.actions;
export default chatSlice.reducer;
