import { useState } from "react";
import { ColorInputs } from "./ColorInputs";
import { PaletteControls } from "./PaletteControls";
import { PaletteList } from "./PaletteList";
import { generatePalettes } from "../utils/colorUtils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Palette } from "../types";

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

  const [paletteSize, setPaletteSize] = useLocalStorage("paletteSize", 3);
  const [numSamples, setNumSamples] = useLocalStorage("numSamples", 50);
  const [palettes, setPalettes] = useLocalStorage<Palette[]>("palettes", []);
  const [usedPalettes, setUsedPalettes] = useLocalStorage<string[]>(
    "usedPalettes",
    []
  );

  const [isShuffling, setIsShuffling] = useState(false);

  const handleGeneratePalettes = () => {
    const validColors = inputColors.filter((color) => color.trim() !== "");
    const newPalettes = generatePalettes(validColors, paletteSize, numSamples);

    const updatedPalettes = newPalettes.map((newPalette) => {
      const paletteKey = JSON.stringify(newPalette.colors);
      return {
        ...newPalette,
        used: usedPalettes.includes(paletteKey),
      };
    });

    setPalettes(updatedPalettes);
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...inputColors];
    newColors[index] = color;
    setInputColors(newColors);
  };

  const handlePaletteSizeChange = (size: number) => {
    setPaletteSize(size);
  };

  const handleNumSamplesChange = (samples: number) => {
    setNumSamples(samples);
  };

  const handlePaletteToggle = (index: number) => {
    const palette = palettes[index];
    const paletteKey = JSON.stringify(palette.colors);

    const newUsedPalettes = palette.used
      ? usedPalettes.filter((key) => key !== paletteKey)
      : [...usedPalettes, paletteKey];

    setUsedPalettes(newUsedPalettes);

    const newPalettes = [...palettes];
    newPalettes[index] = {
      ...newPalettes[index],
      used: !newPalettes[index].used,
    };
    setPalettes(newPalettes);
  };

  const handleShuffle = () => {
    setIsShuffling(true);

    const usedPalettes = palettes.filter((p) => p.used);
    const unusedPalettes = palettes.filter((p) => !p.used);

    const shuffledUnused = [...unusedPalettes].sort(() => Math.random() - 0.5);

    setPalettes([...usedPalettes, ...shuffledUnused]);

    setTimeout(() => setIsShuffling(false), 500);
  };

  const handleClearUsed = () => {
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
        onClearUsed={handleClearUsed}
        onGenerate={handleGeneratePalettes}
        onShuffle={handleShuffle}
        isShuffling={isShuffling}
      />

      <PaletteList
        palettes={palettes}
        onPaletteToggle={handlePaletteToggle}
        isShuffling={isShuffling}
      />
    </div>
  );
}
