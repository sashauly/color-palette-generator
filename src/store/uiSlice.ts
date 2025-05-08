import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiState } from "@/types";

const initialState: UiState = {
  colorInputsOpen: true,
  paletteSizeSelectorOpen: true,
  colorStatisticsOpen: true,
  addUsedPaletteDialogOpen: false,
  paletteSizeConfirmDialogOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleColorInputsOpen: (state) => {
      state.colorInputsOpen = !state.colorInputsOpen;
    },
    setColorInputsOpen: (state, action: PayloadAction<boolean>) => {
      state.colorInputsOpen = action.payload;
    },
    togglePaletteSizeSelectorOpen: (state) => {
      state.paletteSizeSelectorOpen = !state.paletteSizeSelectorOpen;
    },
    setPaletteSizeSelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.paletteSizeSelectorOpen = action.payload;
    },
    toggleColorStatisticsOpen: (state) => {
      state.colorStatisticsOpen = !state.colorStatisticsOpen;
    },
    setColorStatisticsOpen: (state, action: PayloadAction<boolean>) => {
      state.colorStatisticsOpen = action.payload;
    },
    toggleAddUsedPaletteDialogOpen: (state) => {
      state.addUsedPaletteDialogOpen = !state.addUsedPaletteDialogOpen;
    },
    setAddUsedPaletteDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.addUsedPaletteDialogOpen = action.payload;
    },
    setPaletteSizeConfirmDialogOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.paletteSizeConfirmDialogOpen = action.payload;
    },
    togglePaletteSizeConfirmDialogOpen: (state) => {
      state.paletteSizeConfirmDialogOpen = !state.paletteSizeConfirmDialogOpen;
    },
    loadUiState: (state, action: PayloadAction<UiState>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  toggleColorInputsOpen,
  setColorInputsOpen,
  togglePaletteSizeSelectorOpen,
  setPaletteSizeSelectorOpen,
  toggleColorStatisticsOpen,
  setColorStatisticsOpen,
  toggleAddUsedPaletteDialogOpen,
  setAddUsedPaletteDialogOpen,
  togglePaletteSizeConfirmDialogOpen,
  setPaletteSizeConfirmDialogOpen,
  loadUiState,
} = uiSlice.actions;

export default uiSlice.reducer;
