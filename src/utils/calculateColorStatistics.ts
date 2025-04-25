import type { Palette, ColorStatisticsType } from "../types";

interface CalculateColorStatisticsProps {
  palettes: Palette[];
  inputColors: string[];
}

const calculateColorStatistics = ({
  palettes,
  inputColors,
}: CalculateColorStatisticsProps): ColorStatisticsType => {
  const usedPalettes = palettes.filter((palette) => palette.used);
  const statistics: ColorStatisticsType = {};

  usedPalettes.forEach((palette) => {
    const allInputColors = new Set([...inputColors, "absent"]);

    const allPositions = new Set(
      Array.from({ length: palette.colors.length }, (_, i) => i + 1)
    );

    allPositions.forEach((position) => {
      const colorIndex = position - 1;

      let color: string | null = null;
      if (colorIndex < palette.colors.length) {
        color = palette.colors[colorIndex];
      }

      if (!statistics[position]) {
        statistics[position] = {};
        allInputColors.forEach((inputColor) => {
          statistics[position][inputColor] = 0;
        });
      }

      const colorToCount = color !== null ? color : "absent";

      if (!statistics[position][colorToCount]) {
        statistics[position][colorToCount] = 0;
      }

      statistics[position][colorToCount]++;
    });
  });

  Object.keys(statistics).forEach((position) => {
    const positionStats = statistics[Number(position)];

    const sortedColors = Object.entries(positionStats)
      .sort(([, countA], [, countB]) => countB - countA)
      .reduce((obj: { [key: string]: number }, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    statistics[Number(position)] = sortedColors;
  });

  return statistics;
};

export default calculateColorStatistics;
