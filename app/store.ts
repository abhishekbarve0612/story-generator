import { configureStore } from "@reduxjs/toolkit";
import directionInstructionReducer from "./reducerSlices/directionInstructionSlice";
import configReducer from "./reducerSlices/configSlice";

export const store = configureStore({
  reducer: {
    directionInstruction: directionInstructionReducer,
    config: configReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
