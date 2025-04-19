import { Palette } from "../types";

export const calculateTotalPossiblePalettes = (
  inputColorsLength: number,
  paletteSize: number
) => {
  if (inputColorsLength < paletteSize || paletteSize <= 0) {
    return 0;
  }

  const numerator = factorial(inputColorsLength);
  const denominator = factorial(inputColorsLength - paletteSize);

  return numerator / denominator;
};

const factorial = (n: number): number => {
  if (n === 0) {
    return 1;
  }
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
};

export const generatePalettes = (
  inputColors: string[],
  paletteSize: number,
  numSamples: number
): Palette[] => {
  if (inputColors.length === 0 || paletteSize <= 0 || numSamples <= 0) {
    return [];
  }

  const result: Palette[] = [];
  const generateHelper = (
    current: string[],
    remaining: number,
    availableColors: string[]
  ) => {
    if (remaining === 0) {
      result.push({ colors: [...current], used: false });
      return;
    }

    for (const color of availableColors) {
      current.push(color);
      const nextAvailable = availableColors.filter((c) => c !== color);
      generateHelper(current, remaining - 1, nextAvailable);
      current.pop();
    }
  };

  generateHelper([], paletteSize, inputColors);

  if (result.length > numSamples) {
    const shuffled = [...result].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSamples);
  }

  return result;
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
