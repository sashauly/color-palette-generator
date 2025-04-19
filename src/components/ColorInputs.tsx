import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brush } from "lucide-react";

interface ColorInputsProps {
  colors: string[];
  onColorChange: (index: number, color: string) => void;
}

export const ColorInputs: React.FC<ColorInputsProps> = ({
  colors,
  onColorChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brush />
          Input Colors
        </CardTitle>
        <CardDescription>Add colors to generate palettes from.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {colors.map((color, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Label htmlFor={`color-${index}`} className="text-sm font-medium">
                Color {index + 1}
              </Label>
              <div className="flex space-x-2 items-center">
                <Input
                  type="color"
                  id={`color-${index}`}
                  value={color}
                  onChange={(e) => onColorChange(index, e.target.value)}
                  className="cursor-pointer"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => onColorChange(index, e.target.value)}
                  className="font-mono"
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
