import { Palette } from "../types";

export const generatePalettes = (
  inputColors: string[],
  paletteSize: number,
  numSamples: number
): Palette[] => {
  if (inputColors.length === 0 || paletteSize <= 0 || numSamples <= 0) {
    return [];
  }

  const combinations: string[][] = [];

  function combine(
    arr: string[],
    k: number,
    start: number,
    currentCombination: string[]
  ) {
    if (k === 0) {
      combinations.push([...currentCombination]);
      return;
    }

    for (let i = start; i <= arr.length - k; i++) {
      currentCombination.push(arr[i]);
      combine(arr, k - 1, i + 1, currentCombination);
      currentCombination.pop();
    }
  }

  combine(inputColors, paletteSize, 0, []);

  if (numSamples < combinations.length) {
    const sampledCombinations: string[][] = [];
    const indices = new Set<number>();

    while (sampledCombinations.length < numSamples) {
      const randomIndex = Math.floor(Math.random() * combinations.length);
      if (!indices.has(randomIndex)) {
        sampledCombinations.push(combinations[randomIndex]);
        indices.add(randomIndex);
      }
    }

    return sampledCombinations.map((combination) => ({
      colors: combination,
      used: false,
    }));
  }

  return combinations.map((combination) => ({
    colors: combination,
    used: false,
  }));
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
