import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DirectionInstructionState {
  direction: string;
  instructions: string;
}

const initialState: DirectionInstructionState = {
  direction: "",
  instructions: "",
};

export const directionInstructionSlice = createSlice({
  name: "directionInstruction",
  initialState,
  reducers: {
    setInstructions: (state, action: PayloadAction<string>) => {
      state.instructions = action.payload;
    },
    setDirection: (state, action: PayloadAction<string>) => {
      state.direction = action.payload;
    },
  },
});

export const { setDirection, setInstructions } =
  directionInstructionSlice.actions;

export default directionInstructionSlice.reducer;
