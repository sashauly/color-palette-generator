import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Palette, Color, ColorStatisticsType, PaletteState } from "@/types";
import {
  generateId,
  calculateColorStatistics,
  calculateTotalPossiblePermutations,
  generatePalettes,
  arePalettesEqual,
} from "@/utils/helpers";
import { AppDispatch, RootState } from "@/store/store";
import { setPaletteListFilter } from "./uiSlice";

const defaultInputColors: Color[] = [
  { id: generateId(), value: "#FFFFFF" },
  { id: generateId(), value: "#000000" },
  { id: generateId(), value: "#a82b3d" },
  { id: generateId(), value: "#465e7a" },
  { id: generateId(), value: "#92a14f" },
  { id: generateId(), value: "#fac403" },
];

const defaultPaletteSize = 3;

const initialState: PaletteState = {
  inputColors: defaultInputColors,
  paletteSize: defaultPaletteSize,
  generatedPalettes: [],
  statistics: {},
  totalCombinations: 0,
  addManualPaletteStatus: "idle",
};

export const paletteSlice = createSlice({
  name: "palette",
  initialState,
  reducers: {
    setInputColors: (state, action: PayloadAction<Color[]>) => {
      const newInputColors = action.payload;

      const usedPalettes = state.generatedPalettes.filter(
        (palette) => palette.used
      );

      const validatedUsedPalettes = usedPalettes
        .map((palette) => {
          const updatedColors: Color[] = [];
          let isValid = true;

          for (const paletteColor of palette.colors) {
            const correspondingInputColor = newInputColors.find(
              (inputColor) => inputColor.id === paletteColor.id
            );

            if (correspondingInputColor) {
              updatedColors.push(correspondingInputColor);
            } else {
              isValid = false;
              break;
            }
          }

          if (isValid && updatedColors.length === state.paletteSize) {
            return { ...palette, colors: updatedColors };
          } else {
            return null;
          }
        })
        .filter((palette): palette is Palette => palette !== null);

      state.generatedPalettes = validatedUsedPalettes;
      state.inputColors = newInputColors;

      state.totalCombinations = calculateTotalPossiblePermutations(
        state.inputColors.length,
        state.paletteSize
      );
    },
    setPaletteSize: (state, action: PayloadAction<number>) => {
      state.paletteSize = action.payload;

      state.totalCombinations = calculateTotalPossiblePermutations(
        state.inputColors.length,
        state.paletteSize
      );
      state.generatedPalettes = [];
    },
    setGeneratedPalettes: (state, action: PayloadAction<Palette[]>) => {
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
    importState: (_, action: PayloadAction<PaletteState>) => {
      const newState = action.payload;

      const validatedUsedPalettes = newState.generatedPalettes
        .filter((palette) => palette.used)
        .map((palette) => {
          const updatedColors: Color[] = [];
          let isValid = true;
          for (const paletteColor of palette.colors) {
            const correspondingInputColor = newState.inputColors.find(
              (inputColor) => inputColor.id === paletteColor.id
            );

            if (correspondingInputColor) {
              updatedColors.push(correspondingInputColor);
            } else {
              isValid = false;
              break;
            }
          }

          if (isValid && updatedColors.length === newState.paletteSize) {
            return { ...palette, colors: updatedColors };
          } else {
            return null;
          }
        })
        .filter((palette): palette is Palette => palette !== null);

      newState.generatedPalettes = validatedUsedPalettes;

      newState.totalCombinations = calculateTotalPossiblePermutations(
        newState.inputColors.length,
        newState.paletteSize
      );

      return newState;
    },
    addManualPalette: (state, action: PayloadAction<Palette>) => {
      const newPalette = { ...action.payload, used: true };

      const validColors: Color[] = [];
      let isValid = true;
      for (const paletteColor of newPalette.colors) {
        const inputColor = state.inputColors.find(
          (input) => input.id === paletteColor.id
        );
        if (inputColor) {
          validColors.push(inputColor);
        } else {
          isValid = false;
          break;
        }
      }

      if (!isValid || validColors.length !== state.paletteSize) {
        console.warn(
          "Manually added palette does not match current size or input colors."
        );
        state.addManualPaletteStatus = "invalid";
        return;
      }

      const paletteToAdd = { ...newPalette, colors: validColors };

      const newPaletteColorsKey = JSON.stringify(
        paletteToAdd.colors.map((color) => color.value)
      );

      const existingIndex = state.generatedPalettes.findIndex(
        (p) =>
          JSON.stringify(p.colors.map((color) => color.value)) ===
          newPaletteColorsKey
      );

      if (existingIndex === -1) {
        state.generatedPalettes.unshift(paletteToAdd);
        state.addManualPaletteStatus = "added";
      } else {
        if (!state.generatedPalettes[existingIndex].used) {
          state.generatedPalettes[existingIndex].used = true;
          const [movedPalette] = state.generatedPalettes.splice(
            existingIndex,
            1
          );
          state.generatedPalettes.unshift(movedPalette);
          state.addManualPaletteStatus = "exist";
        } else {
          const [movedPalette] = state.generatedPalettes.splice(
            existingIndex,
            1
          );
          state.generatedPalettes.unshift(movedPalette);
          state.addManualPaletteStatus = "already_used";
        }
      }
    },
    resetAddManualPaletteStatus: (state) => {
      state.addManualPaletteStatus = "idle";
    },
  },
});

const generatePalettesForPage =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const paletteState = getState().palette;
    const {
      inputColors,
      paletteSize,
      totalCombinations,
      generatedPalettes: usedAndGenerated,
    } = paletteState;
    dispatch(setPaletteListFilter("all"));

    if (
      inputColors.length < paletteSize ||
      paletteSize <= 0 ||
      totalCombinations === 0
    ) {
      const usedPalettes = usedAndGenerated.filter((p) => p.used);
      dispatch(paletteSlice.actions.setGeneratedPalettes(usedPalettes));
      return;
    }

    const usedPalettes = usedAndGenerated.filter((p) => p.used);

    const newlyGenerated = generatePalettes(inputColors, paletteSize).filter(
      (newPalette) =>
        !usedPalettes.some((usedPalette) =>
          arePalettesEqual(usedPalette, newPalette)
        )
    );

    const allPalettes = [...usedPalettes, ...newlyGenerated];

    dispatch(paletteSlice.actions.setGeneratedPalettes(allPalettes));
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
  setGeneratedPalettes,
  toggleUsedPalette,
  clearAllPalettes,
  clearUsedPalettes,
  updateStatistics,
  importState,
  addManualPalette,
  resetAddManualPaletteStatus,
} = paletteSlice.actions;

export { calculateAndUpdateStatistics, generatePalettesForPage };

export default paletteSlice.reducer;
