import JSZip from "jszip";
import * as fileSaver from "file-saver";
import type { Palette, ColorStatisticsType, Color } from "../types";

export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const calculateTotalPossiblePermutations = (
  inputColorsLength: number,
  paletteSize: number
): number | bigint => {
  if (inputColorsLength < paletteSize || paletteSize <= 0) {
    return 0;
  }
  if (paletteSize === 0) {
    return 1;
  }

  let result: number | bigint = 1;

  const useBigInt = inputColorsLength > 30 || paletteSize > 15;

  if (useBigInt) {
    result = BigInt(1);
    for (let i = 0; i < paletteSize; i++) {
      result = result * BigInt(inputColorsLength - i);
    }
  } else {
    for (let i = 0; i < paletteSize; i++) {
      result = result * (inputColorsLength - i);
      if (typeof result === "number" && result > Number.MAX_SAFE_INTEGER) {
        console.warn(
          "Potential number overflow, switching to BigInt for larger values."
        );
        result = BigInt(Math.round(result as number));
        for (let j = i + 1; j < paletteSize; j++) {
          result = result * BigInt(inputColorsLength - j);
        }
        break;
      }
    }
  }

  return result;
};

export const formatBigInt = (num: bigint | number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const generatePalettes = (
  colors: Color[],
  paletteSize: number
): Palette[] => {
  if (colors.length === 0 || paletteSize <= 0) {
    return [];
  }

  const combinations: Palette[] = [];
  const generateHelper = (
    currentCombination: Color[],
    remaining: number,
    availableColors: Color[]
  ) => {
    if (remaining === 0) {
      combinations.push({
        id: generateId(),
        colors: [...currentCombination],
        used: false,
        createdAt: Date.now(),
      });
      return;
    }

    for (const color of availableColors) {
      currentCombination.push(color);
      const nextAvailable = availableColors.filter((c) => c !== color);
      generateHelper(currentCombination, remaining - 1, nextAvailable);
      currentCombination.pop();
    }
  };

  generateHelper([], paletteSize, colors);

  return shuffleColors(combinations);
};

export const shuffleColors = (palettes: Palette[]): Palette[] => {
  const usedPalettes = palettes.filter((p) => p.used);
  const unusedPalettes = palettes.filter((p) => !p.used);

  const shuffledUnused = [...unusedPalettes].sort(() => Math.random() - 0.5);

  const combinedPalettes = [...usedPalettes, ...shuffledUnused];

  return combinedPalettes;
};

export const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
};

export const getContrastColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export const calculateColorStatistics = (
  palettes: Palette[],
  paletteSize: number,
  inputColors: Color[]
): ColorStatisticsType => {
  const usedPalettes = palettes.filter((palette) => palette.used);
  const statistics: ColorStatisticsType = {};

  for (let i = 1; i <= paletteSize; i++) {
    statistics[i] = {};
    inputColors.forEach((color) => {
      statistics[i][color.value] = 0;
    });
  }

  usedPalettes.forEach((palette) => {
    palette.colors.forEach((color, index) => {
      const position = index + 1;
      if (
        statistics[position] &&
        statistics[position][color.value] !== undefined
      ) {
        statistics[position][color.value]++;
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

export const exportToZip = async (state: any): Promise<void> => {
  try {
    const zip = new JSZip();
    const content = JSON.stringify(state, null, 2);
    zip.file("color-palette-generator-data.json", content);

    const blob = await zip.generateAsync({ type: "blob" });
    fileSaver.saveAs(blob, "color-palette-generator-data.zip");
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
};
