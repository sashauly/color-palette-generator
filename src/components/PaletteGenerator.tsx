import { useState, useCallback, useMemo, useEffect } from "react";
import { ColorInputs } from "./ColorInputs";
import { PaletteControls } from "./PaletteControls";
import { PaletteList } from "./PaletteList";
import { generatePalettes } from "../utils/colorUtils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Palette } from "../types";
import { debounce } from "lodash";
import { toast } from "sonner";

const defaultColors = [
  "#dbdbd9", // white
  "#000000", // black
  "#a82b3d", // red
  "#465e7a", // blue
  "#92a14f", // green
  "#fac403", // yellow
];

export default function PaletteGenerator() {
  const [inputColors, setInputColors] = useLocalStorage(
    "inputColors",
    defaultColors
  );
  const [paletteSize, setPaletteSize, paletteSizeInitialized] = useLocalStorage(
    "paletteSize",
    3
  );
  const [numSamples, setNumSamples, numSamplesInitialized] = useLocalStorage(
    "numSamples",
    50
  );
  const [palettes, setPalettes] = useLocalStorage<Palette[]>("palettes", []);
  const [usedPalettes, setUsedPalettes] = useLocalStorage<string[]>(
    "usedPalettes",
    []
  );

  const [isShuffling, setIsShuffling] = useState(false);

  const validColors = useMemo(
    () => inputColors.filter((color) => color.trim() !== ""),
    [inputColors]
  );

  const memoizedPalettes = useMemo(() => palettes, [palettes]);

  const generate = useCallback(() => {
    const newPalettes = generatePalettes(validColors, paletteSize, numSamples);

    const updatedPalettes = newPalettes.map((newPalette) => {
      const paletteKey = JSON.stringify(newPalette.colors);
      return {
        ...newPalette,
        used: usedPalettes.includes(paletteKey),
      };
    });

    setPalettes(updatedPalettes);
  }, [validColors, paletteSize, numSamples, usedPalettes, setPalettes]);

  const handleGeneratePalettes = useMemo(
    () => debounce(generate, 300),
    [generate]
  );

  const handleColorChange = useCallback(
    (index: number, color: string) => {
      // @ts-expect-error -  Argument of type '(prevColors: string[]) => string[]' is not assignable to parameter of type 'string[]'.
      setInputColors((prevColors: string[]) => {
        const newColors = [...prevColors];
        newColors[index] = color;
        return newColors;
      });
    },
    [setInputColors]
  );

  const handlePaletteSizeChange = useCallback(
    (size: number) => {
      setPaletteSize(size);
    },
    [setPaletteSize]
  );

  const handleNumSamplesChange = useCallback(
    (samples: number) => {
      setNumSamples(samples);
    },
    [setNumSamples]
  );

  const handlePaletteToggle = useCallback(
    (index: number) => {
      const palette = memoizedPalettes[index];
      const paletteKey = JSON.stringify(palette.colors);

      // @ts-expect-error -  Argument of type '(prevUsedPalettes: string[]) => string[]' is not assignable to parameter of type 'string[]'.
      setUsedPalettes((prevUsedPalettes: string[]) => {
        return palette.used
          ? prevUsedPalettes.filter((key) => key !== paletteKey)
          : [...prevUsedPalettes, paletteKey];
      });

      // @ts-expect-error -  Argument of type '(prevPalettes: Palette[]) => Palette[]' is not assignable to parameter of type 'Palette[]'.
      setPalettes((prevPalettes: Palette[]) => {
        const newPalettes = [...prevPalettes];
        newPalettes[index] = {
          ...newPalettes[index],
          used: !newPalettes[index].used,
        };
        return newPalettes;
      });
    },
    [setPalettes, setUsedPalettes, memoizedPalettes]
  );

  const handleShuffle = useCallback(() => {
    setIsShuffling(true);

    // @ts-expect-error -  Argument of type '(prevPalettes: Palette[]) => Palette[]' is not assignable to parameter of type 'Palette[]'.
    setPalettes((prevPalettes: Palette[]) => {
      const usedPalettes = prevPalettes.filter((p) => p.used);
      const unusedPalettes = prevPalettes.filter((p) => !p.used);

      const shuffledUnused = [...unusedPalettes].sort(
        () => Math.random() - 0.5
      );

      const combinedPalettes = [...usedPalettes, ...shuffledUnused];

      return combinedPalettes;
    });

    setTimeout(() => setIsShuffling(false), 500);
  }, [setPalettes]);

  const handleClearPalettes = useCallback(() => {
    setPalettes([]);
  }, [setPalettes]);

  useEffect(() => {
    if (!paletteSizeInitialized) {
      setPaletteSize(3);
    }
    if (!numSamplesInitialized) {
      setNumSamples(50);
    }
  }, [
    numSamplesInitialized,
    setNumSamples,
    paletteSizeInitialized,
    setPaletteSize,
  ]);

  const handleClearUsed = () => {
    if (usedPalettes.length === 0) {
      toast.error("No palettes to clear");
    }
    setUsedPalettes([]);
    setPalettes(palettes.map((palette) => ({ ...palette, used: false })));
  };

  return (
    <div className="space-y-8">
      <ColorInputs colors={inputColors} onColorChange={handleColorChange} />

      <PaletteControls
        paletteSize={paletteSize}
        numSamples={numSamples}
        onPaletteSizeChange={handlePaletteSizeChange}
        onNumSamplesChange={handleNumSamplesChange}
        onGenerate={handleGeneratePalettes}
        onShuffle={handleShuffle}
        onClearUsed={handleClearUsed}
        onClearAll={handleClearPalettes}
        isShuffling={isShuffling}
      />

      <PaletteList
        palettes={memoizedPalettes}
        onPaletteToggle={handlePaletteToggle}
        isShuffling={isShuffling}
      />
    </div>
  );
}
