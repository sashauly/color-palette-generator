import React from "react";
import { Palette } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaletteListProps {
  palettes: Palette[];
  onPaletteToggle: (index: number) => void;
  isShuffling: boolean;
}

export const PaletteList: React.FC<PaletteListProps> = ({
  palettes,
  onPaletteToggle,
  isShuffling,
}) => {
  if (palettes.length === 0) {
    return <div className="text-center py-8">No palettes generated yet.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Palettes</CardTitle>
        <CardDescription>
          {palettes.length} palettes generated. Check the box to mark a palette
          as used.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`transition-opacity duration-200 ${
            isShuffling ? "opacity-50" : "opacity-100"
          }`}
        >
          <ul className="space-y-3">
            {palettes.map((palette, index) => (
              <li
                key={palette.colors.join("-") + index}
                className={`
                flex items-center p-3 rounded border
                ${
                  palette.used
                    ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }
                transition-all duration-200 hover:shadow-md
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
                        className="flex flex-col items-center"
                      >
                        <div
                          className="h-10 w-10 sm:h-16 sm:w-16 rounded-md border border-gray-200 dark:border-gray-700"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-xs font-mono mt-1 hidden sm:block">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
