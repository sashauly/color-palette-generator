import type { Palette } from "@/types";
import calculateColorStatistics from "@/utils/calculateColorStatistics";
import { generatePalettes } from "@/utils/colorUtils";
import { debounce } from "lodash";
import { useCallback, useMemo } from "react";

export function usePaletteGeneration(
  validColors: string[],
  paletteSize: number,
  numSamples: number,
  palettes: Palette[],
  setPalettes: (palettes: Palette[]) => void,
  usedPalettes: string[],
  setIsGenerating: (isGenerating: boolean) => void
) {
  const generate = useCallback(() => {
    setIsGenerating(true);
    try {
      const usedPalettesToKeep = palettes.filter((p) => p.used);
      let numPalettesToGenerate = numSamples - usedPalettesToKeep.length;

      let newPalettes: Palette[] = [];

      while (numPalettesToGenerate > 0) {
        const generated = generatePalettes(
          validColors,
          paletteSize,
          numPalettesToGenerate
        );

        const filteredGenerated = generated.filter((newPalette) => {
          const newPaletteKey = JSON.stringify(newPalette.colors);
          return (
            !usedPalettesToKeep.some(
              (usedPalette) =>
                JSON.stringify(usedPalette.colors) === newPaletteKey
            ) &&
            !newPalettes.some(
              (existingNewPalette) =>
                JSON.stringify(existingNewPalette.colors) === newPaletteKey
            )
          );
        });

        newPalettes = [...newPalettes, ...filteredGenerated];
        numPalettesToGenerate =
          numSamples - usedPalettesToKeep.length - newPalettes.length;
      }

      const combinedPalettes = [...usedPalettesToKeep, ...newPalettes];
      const finalPalettes = combinedPalettes.slice(0, numSamples);

      const updatedPalettes = finalPalettes.map((palette) => {
        const paletteKey = JSON.stringify(palette.colors);
        return {
          ...palette,
          used: usedPalettes.includes(paletteKey),
        };
      });

      setPalettes(updatedPalettes);
    } finally {
      setIsGenerating(false);
    }
  }, [
    validColors,
    paletteSize,
    numSamples,
    usedPalettes,
    setPalettes,
    palettes,
    setIsGenerating,
  ]);

  const handleGeneratePalettes = useMemo(
    () => debounce(generate, 300),
    [generate]
  );

  const colorStatistics = useMemo(
    () =>
      calculateColorStatistics({
        palettes,
        paletteSize,
        inputColors: validColors,
      }),
    [palettes, paletteSize, validColors]
  );

  return {
    handleGeneratePalettes,
    colorStatistics,
  };
}
