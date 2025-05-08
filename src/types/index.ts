export interface Color {
  id: string;
  value: string;
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
  addManualPaletteStatus: AddManualPaletteStatus;
}

export interface UiState {
  colorInputsOpen: boolean;
  paletteSizeSelectorOpen: boolean;
  colorStatisticsOpen: boolean;
  addUsedPaletteDialogOpen: boolean;
  paletteSizeConfirmDialogOpen: boolean;
  importExportOpen: boolean;
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

export type AddManualPaletteStatus =
  | "idle"
  | "added"
  | "exist"
  | "already_used"
  | "invalid";
