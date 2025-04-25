import type { Palette } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { useEffect, useMemo } from "react";
import { calculateTotalPossiblePalettes } from "@/utils/colorUtils";

export function usePalettes(
  initialColors: string[],
  defaultPaletteSize: number,
  defaultNumSamples: number
) {
  const [inputColors, setInputColors] = useLocalStorage(
    "inputColors",
    initialColors
  );
  const [paletteSize, setPaletteSize, paletteSizeInitialized] = useLocalStorage(
    "paletteSize",
    defaultPaletteSize
  );
  const [numSamples, setNumSamples, numSamplesInitialized] = useLocalStorage(
    "numSamples",
    defaultNumSamples
  );
  const [palettes, setPalettes] = useLocalStorage<Palette[]>("palettes", []);
  const [usedPalettes, setUsedPalettes] = useLocalStorage<string[]>(
    "usedPalettes",
    []
  );

  useEffect(() => {
    if (!paletteSizeInitialized) {
      setPaletteSize(defaultPaletteSize);
    }
    if (!numSamplesInitialized) {
      setNumSamples(defaultNumSamples);
    }
  }, [
    numSamplesInitialized,
    setNumSamples,
    paletteSizeInitialized,
    setPaletteSize,
    defaultNumSamples,
    defaultPaletteSize,
  ]);

  const validColors = useMemo(
    () => inputColors.filter((color) => color.trim() !== ""),
    [inputColors]
  );

  const totalPossiblePalettes = useMemo(
    () => calculateTotalPossiblePalettes(inputColors.length, paletteSize),
    [inputColors, paletteSize]
  );

  return {
    inputColors,
    setInputColors,
    paletteSize,
    setPaletteSize,
    numSamples,
    setNumSamples,
    palettes,
    setPalettes,
    usedPalettes,
    setUsedPalettes,
    validColors,
    totalPossiblePalettes,
  };
}
