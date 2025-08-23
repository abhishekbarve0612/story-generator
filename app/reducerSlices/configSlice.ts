import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ConfigState {
  characterText: string;
  lore: string;
  scenario: string;
  message: string;
  selectedCharacter: string;
}

const initialState: ConfigState = {
  characterText: "",
  lore: "",
  scenario: "",
  message: "",
  selectedCharacter: "",
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setCharacterText: (state, action: PayloadAction<string>) => {
      state.characterText = action.payload;
    },
    setLore: (state, action: PayloadAction<string>) => {
      state.lore = action.payload;
    },
    setScenario: (state, action: PayloadAction<string>) => {
      state.scenario = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setSelectedCharacter: (state, action: PayloadAction<string>) => {
      state.selectedCharacter = action.payload;
    },
  },
});

export const {
  setCharacterText,
  setLore,
  setScenario,
  setMessage,
  setSelectedCharacter,
} = configSlice.actions;

export default configSlice.reducer;
