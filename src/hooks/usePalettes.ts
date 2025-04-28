import type { Palette } from "@/types";
import { useLocalStorage } from "@uidotdev/usehooks";
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
  const [paletteSize, setPaletteSize] = useLocalStorage(
    "paletteSize",
    defaultPaletteSize
  );
  const [numSamples, setNumSamples] = useLocalStorage(
    "numSamples",
    defaultNumSamples
  );
  const [palettes, setPalettes] = useLocalStorage<Palette[]>("palettes", []);
  const [usedPalettes, setUsedPalettes] = useLocalStorage<string[]>(
    "usedPalettes",
    []
  );

  useEffect(() => {
    if (!paletteSize) {
      setPaletteSize(defaultPaletteSize);
    }
    if (!numSamples) {
      setNumSamples(defaultNumSamples);
    }
  }, [
    numSamples,
    setNumSamples,
    paletteSize,
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
