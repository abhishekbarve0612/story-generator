import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  speaker: string;
}

export interface ChatState {
  chat: ChatMessage[];
  summary: string;
}

const initialState: ChatState = {
  chat: [
    {
      id: "1",
      role: "system",
      content: "You are a helpful assistant.",
      speaker: "Narrator",
    },
  ],
  summary: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action: PayloadAction<ChatMessage[]>) => {
      state.chat = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chat.push(action.payload);
    },
    clearChat: (state) => {
      state.chat = [];
    },
    setSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
    },
  },
});

export const { setChat, addMessage, clearChat, setSummary } = chatSlice.actions;

export default chatSlice.reducer;
