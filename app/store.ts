import { configureStore } from "@reduxjs/toolkit";
import directionInstructionReducer from "./reducerSlices/directionInstructionSlice";
import configReducer from "./reducerSlices/configSlice";
import llmResponsesReducer from "./reducerSlices/llmResponsesSlice";

export const store = configureStore({
  reducer: {
    directionInstruction: directionInstructionReducer,
    config: configReducer,
    llmResponses: llmResponsesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
