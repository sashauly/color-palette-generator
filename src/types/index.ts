export interface Color {
  id: string;
  value: string;
  label?: string;
}

export interface Palette {
  id: string;
  colors: Color[];
  used: boolean;
  createdAt: number;
}

export interface PaletteState {
  inputColors: Color[];
  paletteSize: number;
  generatedPalettes: Palette[];
  statistics: ColorStatisticsType;
  totalCombinations: number | bigint;
}

export interface UiState {
  colorInputsOpen: boolean;
  paletteSizeSelectorOpen: boolean;
  colorStatisticsOpen: boolean;
  addUsedPaletteDialogOpen: boolean;
}

export interface AppState {
  palette: PaletteState;
  ui: UiState;
}

export type ColorStatisticsType = {
  [position: number]: {
    [color: string]: number;
  };
};
