import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Palette, Color, ColorStatisticsType, PaletteState } from "@/types";
import {
  generateId,
  calculateColorStatistics,
  calculateTotalPossiblePermutations,
  generatePalettes,
} from "@/utils/helpers";
import { AppDispatch, RootState } from "@/store/store";

const defaultInputColors: Color[] = [
  { id: generateId(), value: "#FFFFFF", label: "White" },
  { id: generateId(), value: "#000000", label: "Black" },
  { id: generateId(), value: "#a82b3d", label: "Red" },
  { id: generateId(), value: "#465e7a", label: "Blue" },
  { id: generateId(), value: "#92a14f", label: "Green" },
  { id: generateId(), value: "#fac403", label: "Yellow" },
];

const defaultPaletteSize = 3;

const initialState: PaletteState = {
  inputColors: defaultInputColors,
  paletteSize: defaultPaletteSize,
  generatedPalettes: [],
  statistics: {},
  totalCombinations: 0,
};

export const paletteSlice = createSlice({
  name: "palette",
  initialState,
  reducers: {
    setInputColors: (state, action: PayloadAction<Color[]>) => {
      state.inputColors = action.payload;

      state.totalCombinations = calculateTotalPossiblePermutations(
        state.inputColors.length,
        state.paletteSize
      );
      state.generatedPalettes = [];
    },
    setPaletteSize: (state, action: PayloadAction<number>) => {
      state.paletteSize = action.payload;

      state.totalCombinations = calculateTotalPossiblePermutations(
        state.inputColors.length,
        state.paletteSize
      );
      state.generatedPalettes = [];
    },
    setPalettes: (state, action: PayloadAction<Palette[]>) => {
      state.generatedPalettes = action.payload;
    },
    toggleUsedPalette: (state, action: PayloadAction<string>) => {
      state.generatedPalettes = state.generatedPalettes.map((palette) =>
        palette.id === action.payload
          ? { ...palette, used: !palette.used }
          : palette
      );
    },
    clearAllPalettes: (state) => {
      state.generatedPalettes = [];
    },
    clearUsedPalettes: (state) => {
      state.generatedPalettes = state.generatedPalettes.filter((p) => !p.used);
    },
    updateStatistics: (state, action: PayloadAction<ColorStatisticsType>) => {
      state.statistics = action.payload;
    },
    importState: (state, action: PayloadAction<PaletteState>) => {
      const newState = action.payload;

      newState.totalCombinations = calculateTotalPossiblePermutations(
        newState.inputColors.length,
        newState.paletteSize
      );

      return newState;
    },
    addManualPalette: (state, action: PayloadAction<Palette>) => {
      const newPalette = { ...action.payload, used: true };

      const newPaletteColorsKey = JSON.stringify(
        newPalette.colors.map((color) => color.value)
      );

      const existingIndex = state.generatedPalettes.findIndex(
        (p) =>
          JSON.stringify(p.colors.map((color) => color.value)) ===
          newPaletteColorsKey
      );

      if (existingIndex === -1) {
        state.generatedPalettes.unshift(newPalette);
      } else {
        state.generatedPalettes.splice(existingIndex, 1);
        state.generatedPalettes.unshift(newPalette);
      }
    },
  },
});

const generatePalettesForPage =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().palette;
    const { inputColors, paletteSize, totalCombinations } = state;

    if (
      inputColors.length < paletteSize ||
      paletteSize <= 0 ||
      totalCombinations === 0
    ) {
      dispatch(paletteSlice.actions.setPalettes([]));
      return;
    }

    const palettesForPage = generatePalettes(inputColors, paletteSize);

    dispatch(paletteSlice.actions.setPalettes(palettesForPage));
  };

const calculateAndUpdateStatistics =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().palette;
    const statistics = calculateColorStatistics(
      state.generatedPalettes,
      state.paletteSize,
      state.inputColors
    );
    dispatch(paletteSlice.actions.updateStatistics(statistics));
  };

export const {
  setInputColors,
  setPaletteSize,
  setPalettes,
  toggleUsedPalette,
  clearAllPalettes,
  clearUsedPalettes,
  updateStatistics,
  importState,
  addManualPalette,
} = paletteSlice.actions;

export { calculateAndUpdateStatistics, generatePalettesForPage };

export default paletteSlice.reducer;
