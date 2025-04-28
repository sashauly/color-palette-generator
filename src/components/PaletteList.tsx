import React from "react";
import type { Palette } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Palette as PaletteIcon } from "lucide-react";
import { Button } from "./ui/button";

interface PaletteListProps {
  palettes: Palette[];
  onPaletteToggle: (index: number) => void;
  isShuffling: boolean;
  handleOpenAddPaletteDialog: () => void;
}

export const PaletteList: React.FC<PaletteListProps> = ({
  palettes,
  onPaletteToggle,
  isShuffling,
  handleOpenAddPaletteDialog,
}) => {
  const getColorSize = () => {
    const baseSize = "clamp(2.5rem, 4vw, 3.5rem)";
    return {
      width: baseSize,
      height: baseSize,
    };
  };

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PaletteIcon />
          Generated Palettes
        </CardTitle>
        <CardDescription>
          {palettes.length} palettes generated. Check the box to mark a palette
          as used.
        </CardDescription>
        <Button onClick={handleOpenAddPaletteDialog}>Add Used Palette</Button>
      </CardHeader>
      <CardContent>
        {palettes.length === 0 ? (
          <div className="text-center py-8">No palettes generated yet.</div>
        ) : (
          <ul
            className={`
          transition-opacity duration-200 grid gap-4
          ${isShuffling ? "opacity-50" : "opacity-100"}
          md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        `}
          >
            {palettes.map((palette, index) => (
              <li
                key={palette.colors.join("-") + index}
                className={`
                flex items-center p-2 rounded border transition-all duration-200
                hover:shadow-md cursor-pointer justify-around
                ${
                  palette.used
                    ? "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700"
                    : "border-gray-200 bg-white dark:border-gray-700"
                }
              `}
              >
                <Checkbox
                  id={`palette-${index}`}
                  checked={palette.used}
                  onCheckedChange={() => onPaletteToggle(index)}
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
                />

                <label
                  htmlFor={`palette-${index}`}
                  className={`
                  flex-1 flex items-center cursor-pointer
                  ${
                    palette.used
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : ""
                  }
                `}
                >
                  <span className="mr-2">{index + 1}.</span>

                  <div className="flex flex-1 space-x-2">
                    {palette.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex flex-col items-center group relative"
                      >
                        <div
                          className="rounded-md border border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out hover:-translate-y-1"
                          style={{
                            ...getColorSize(),
                            backgroundColor: color,
                          }}
                        />
                        <span className="text-xs font-mono mt-1 absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
