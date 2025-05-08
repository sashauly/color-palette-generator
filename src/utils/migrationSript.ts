import fs from "node:fs";
import { generateId } from "./helpers.ts";
import {
  AppState,
  PaletteState,
  UiState,
  Color,
  Palette,
} from "../types/index.ts";

// --- Old Interfaces ---
export interface OldPalette {
  colors: string[];
  used: boolean;
}

export type OldColorStatisticsType = {
  [position: number]: {
    [color: string]: number;
  };
};

export interface OldLocalStorageData {
  colorInputsOpen: boolean;
  colorStatisticsOpen: boolean;
  inputColors: string[];
  paletteSize: number;
  numSamples: number;
  palettes: OldPalette[];
  settingsOpen: boolean;
  usedPalettes: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// A simple function to attempt to give a basic label based on color, or just use the hex
const getColorLabel = (hex: string): string => {
  const knownColors: { [key: string]: string } = {
    "#FFFFFF": "White",
    "#000000": "Black",
    "#a82b3d": "Red",
    "#465e7a": "Blue",
    "#92a14f": "Green",
    "#fac403": "Yellow",
  };
  return knownColors[hex.toUpperCase()] || hex.toUpperCase();
};

const migrateData = (oldData: OldLocalStorageData): AppState => {
  const newPalette: PaletteState = {
    inputColors: [],
    paletteSize: oldData.paletteSize || 3,
    generatedPalettes: [],
    statistics: {},
    totalCombinations: oldData.numSamples || 120,
    addManualPaletteStatus: "idle",
  };

  // Defaulting these based on the new types.
  // You might want to add these to the oldData interface if they were intended
  // to be there but weren't explicitly defined.
  const newUi: UiState = {
    colorInputsOpen: oldData.colorInputsOpen || false,
    paletteSizeSelectorOpen: oldData.settingsOpen || false,
    colorStatisticsOpen: oldData.colorStatisticsOpen || false,
    addUsedPaletteDialogOpen: false,
    paletteSizeConfirmDialogOpen: false,
    importExportOpen: false,
    paletteListFilter: "all",
  };

  const colorMap = new Map<string, Color>();
  if (oldData.inputColors && Array.isArray(oldData.inputColors)) {
    oldData.inputColors.forEach((colorHex) => {
      const newColor: Color = {
        id: generateId(),
        value: colorHex.toUpperCase(),
      };
      newPalette.inputColors.push(newColor);
      colorMap.set(colorHex.toUpperCase(), newColor);
    });
  }

  // Initialize statistics based on input colors and positions 1, 2, and 3
  if (newPalette.inputColors.length > 0) {
    for (let i = 1; i <= 3; i++) {
      newPalette.statistics[i] = {};
      newPalette.inputColors.forEach((color) => {
        newPalette.statistics[i][color.value] = 0;
      });
    }
  }

  if (oldData.palettes && Array.isArray(oldData.palettes)) {
    oldData.palettes.forEach((palette) => {
      if (palette.colors && Array.isArray(palette.colors)) {
        const newPaletteColors: Color[] = palette.colors.map((colorHex) => {
          const mappedColor = colorMap.get(colorHex.toUpperCase());
          return (
            mappedColor || {
              id: generateId(),
              value: colorHex.toUpperCase(),
              label: getColorLabel(colorHex),
            }
          );
        });

        const newGeneratedPalette: Palette = {
          id: generateId(),
          colors: newPaletteColors,
          used: palette.used || false,
          createdAt: Date.now(),
        };
        newPalette.generatedPalettes.push(newGeneratedPalette);
      }
    });
  }

  // Note: The old `usedPalettes` is not directly migrated as the new structure
  // uses the `used` flag on individual generated palettes.

  return {
    palette: newPalette,
    ui: newUi,
  };
};

// --- File Handling Functions ---

/**
 * Reads data from a JSON file.
 * @param filePath The path to the JSON file.
 * @returns The parsed JSON data, or null if an error occurs.
 */
const readJsonFile = <T>(filePath: string): T | null => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`Error reading JSON file at ${filePath}:`, error);
    return null;
  }
};

/**
 * Writes data to a JSON file.
 * @param filePath The path to the JSON file.
 * @param data The data to write.
 * @returns True if the write was successful, false otherwise.
 */
const writeJsonFile = <T>(filePath: string, data: T): boolean => {
  try {
    const jsonString = JSON.stringify(data, null, 2); // Pretty print with 2 spaces
    fs.writeFileSync(filePath, jsonString, "utf-8");
    return true;
  } catch (error) {
    console.error(`Error writing JSON file to ${filePath}:`, error);
    return false;
  }
};

// Assuming you have an 'old_data.json' file with the old structure
const oldDataFilePath = "localStorage_data.json";
const newDataFilePath = "new_data.json";

const oldDataFromFile = readJsonFile<OldLocalStorageData>(oldDataFilePath);

if (oldDataFromFile) {
  const newData = migrateData(oldDataFromFile);
  const success = writeJsonFile<AppState>(newDataFilePath, newData);

  if (success) {
    console.log(`Migration successful! New data written to ${newDataFilePath}`);
  } else {
    console.error("Migration failed: Could not write new data to file.");
  }
} else {
  console.error("Migration failed: Could not read old data from file.");
}
