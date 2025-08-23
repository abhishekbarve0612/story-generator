import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "@/utils/types";

export interface LLMResponsesState {
  characters: Record<string, Character>;
  scenarios: Record<string, string>;
  directions: Record<string, string>;
  instructions: Record<string, string>;
}

const initialState: LLMResponsesState = {
  characters: {},
  scenarios: {},
  directions: {},
  instructions: {},
};

export const llmResponsesSlice = createSlice({
  name: "llmResponses",
  initialState,
  reducers: {
    setCharacters: (
      state,
      action: PayloadAction<Record<string, Character>>
    ) => {
      state.characters = action.payload;
    },
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters[action.payload.id] = action.payload;
    },
    setScenarios: (state, action: PayloadAction<Record<string, string>>) => {
      state.scenarios = action.payload;
    },
    setDirections: (state, action: PayloadAction<Record<string, string>>) => {
      state.directions = action.payload;
    },
    setInstructions: (state, action: PayloadAction<Record<string, string>>) => {
      state.instructions = action.payload;
    },
  },
});

export const {
  setCharacters,
  addCharacter,
  setScenarios,
  setDirections,
  setInstructions,
} = llmResponsesSlice.actions;

export default llmResponsesSlice.reducer;
