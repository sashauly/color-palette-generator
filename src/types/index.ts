export interface Palette {
  colors: string[];
  used: boolean;
}

export type ColorStatisticsType = {
  [position: number]: {
    [color: string]: number;
  };
};
