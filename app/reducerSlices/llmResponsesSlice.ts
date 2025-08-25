import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "@/utils/types";

export interface LLMResponsesState {
  characters: Record<string, Character>;
  lore: string;
  scenarios: string;
  directions: string;
  instructions: string;
}

const initialState: LLMResponsesState = {
  characters: {},
  lore: "",
  scenarios: "",
  directions: "",
  instructions: "",
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
    deleteCharacter: (state, action: PayloadAction<string>) => {
      delete state.characters[action.payload];
    },
    setLore: (state, action: PayloadAction<string>) => {
      state.lore = action.payload;
    },
    setScenario: (state, action: PayloadAction<string>) => {
      state.scenarios = action.payload;
    },
    setDirections: (state, action: PayloadAction<string>) => {
      state.directions = action.payload;
    },
    setInstructions: (state, action: PayloadAction<string>) => {
      state.instructions = action.payload;
    },
  },
});

export const {
  setCharacters,
  addCharacter,
  deleteCharacter,
  setLore,
  setScenario,
  setDirections,
  setInstructions,
} = llmResponsesSlice.actions;

export default llmResponsesSlice.reducer;
