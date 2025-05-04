export interface Palette {
  colors: string[];
  used: boolean;
}

export type ColorStatisticsType = {
  [position: number]: {
    [color: string]: number;
  };
};

export interface LocalStorageData {
  colorInputsOpen: boolean;
  colorStatisticsOpen: boolean;
  inputColors: string[];
  paletteSize: number;
  numSamples: number;
  palettes: Palette[];
  settingsOpen: boolean;
  usedPalettes: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
