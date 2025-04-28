import type { Palette, ColorStatisticsType } from "../types";

interface CalculateColorStatisticsProps {
  palettes: Palette[];
  paletteSize: number;
  inputColors: string[];
}

const calculateColorStatistics = ({
  palettes,
  paletteSize,
  inputColors,
}: CalculateColorStatisticsProps): ColorStatisticsType => {
  const usedPalettes = palettes.filter((palette) => palette.used);
  const statistics: ColorStatisticsType = {};

  for (let i = 1; i <= paletteSize; i++) {
    statistics[i] = {};
    inputColors.forEach((color) => {
      statistics[i][color] = 0;
    });
  }

  usedPalettes.forEach((palette) => {
    palette.colors.forEach((color, index) => {
      const position = index + 1;
      if (statistics[position] && statistics[position][color] !== undefined) {
         statistics[position][color]++;
      }
    });
  });

  Object.keys(statistics).forEach((positionKey) => {
    const position = Number(positionKey);
    const positionStats = statistics[position];

    const sortedColors = Object.entries(positionStats)
      .sort(([, countA], [, countB]) => countB - countA)
      .reduce((obj: { [key: string]: number }, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    statistics[position] = sortedColors;
  });

  return statistics;
};

export default calculateColorStatistics;
