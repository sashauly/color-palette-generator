import { useState, useCallback, useMemo } from "react";
import { ColorInputs } from "./ColorInputs";
import { PaletteControls } from "./PaletteControls";
import { PaletteList } from "./PaletteList";
import { Palette } from "../types";
import { toast } from "sonner";
import { AddUsedPalette } from "./AddUsedPalette";
import { ColorStatistics } from "./ColorStatistics";
import { usePalettes } from "@/hooks/usePalettes";
import { usePaletteGeneration } from "@/hooks/usePaletteGeneration";

const DEFAULT_PALETTE_SIZE = 3;
const DEFAULT_NUM_SAMPLES = 50;

const defaultColors = [
  "#dbdbd9", // white
  "#000000", // black
  "#a82b3d", // red
  "#465e7a", // blue
  "#92a14f", // green
  "#fac403", // yellow
];

export default function PaletteGenerator() {
  const {
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
  } = usePalettes(defaultColors, DEFAULT_PALETTE_SIZE, DEFAULT_NUM_SAMPLES);

  const { handleGeneratePalettes, colorStatistics } = usePaletteGeneration(
    validColors,
    paletteSize,
    numSamples,
    palettes,
    setPalettes,
    usedPalettes
  );

  const [isShuffling, setIsShuffling] = useState(false);
  const [isAddPaletteDialogOpen, setIsAddPaletteDialogOpen] = useState(false);

  const memoizedPalettes = useMemo(() => palettes, [palettes]);

  const handleColorChange = useCallback(
    (index: number, color: string) => {
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

      setUsedPalettes((prevUsedPalettes: string[]) => {
        return palette.used
          ? prevUsedPalettes.filter((key) => key !== paletteKey)
          : [...prevUsedPalettes, paletteKey];
      });

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
    setUsedPalettes([]);
  }, [setPalettes, setUsedPalettes]);

  const handleClearUsed = () => {
    if (usedPalettes.length === 0) {
      toast.error("No palettes to clear");
    }
    setUsedPalettes([]);
    setPalettes(palettes.map((palette) => ({ ...palette, used: false })));
  };

  const handleOpenAddPaletteDialog = () => {
    setIsAddPaletteDialogOpen(true);
  };

  const handleCloseAddPaletteDialog = () => {
    setIsAddPaletteDialogOpen(false);
  };

  const handleAddPalette = (newPalette: Palette) => {
    const newPaletteKey = JSON.stringify(newPalette.colors);

    setUsedPalettes((prevUsedPalettes: string[]) => {
      const keyExists = prevUsedPalettes.includes(newPaletteKey);
      return keyExists
        ? prevUsedPalettes
        : [...prevUsedPalettes, newPaletteKey];
    });

    setPalettes((prevPalettes: Palette[]) => {
      const newPaletteObj = { ...newPalette, used: true };
      const existingIndex = prevPalettes.findIndex(
        (p) => JSON.stringify(p.colors) === newPaletteKey
      );

      if (existingIndex === -1) {
        const updatedPalettes = [...prevPalettes, newPaletteObj];
        return updatedPalettes.length > numSamples
          ? updatedPalettes.slice(0, numSamples)
          : updatedPalettes;
      } else {
        const updatedPalettes = [...prevPalettes];
        updatedPalettes.splice(existingIndex, 1);
        updatedPalettes.unshift(newPaletteObj);

        return updatedPalettes;
      }
    });
  };

  return (
    <div className="space-y-2">
      <ColorInputs colors={inputColors} onColorChange={handleColorChange} />

      <PaletteControls
        paletteSize={paletteSize}
        totalPossiblePalettes={totalPossiblePalettes}
        numSamples={numSamples}
        onPaletteSizeChange={handlePaletteSizeChange}
        onNumSamplesChange={handleNumSamplesChange}
        onGenerate={handleGeneratePalettes}
        onShuffle={handleShuffle}
        onClearUsed={handleClearUsed}
        onClearAll={handleClearPalettes}
        isShuffling={isShuffling}
      />

      <ColorStatistics statistics={colorStatistics} />

      <PaletteList
        palettes={memoizedPalettes}
        onPaletteToggle={handlePaletteToggle}
        isShuffling={isShuffling}
        handleOpenAddPaletteDialog={handleOpenAddPaletteDialog}
      />

      <AddUsedPalette
        isOpen={isAddPaletteDialogOpen}
        onClose={handleCloseAddPaletteDialog}
        validColors={validColors}
        paletteSize={paletteSize}
        onAddPalette={handleAddPalette}
      />
    </div>
  );
}
