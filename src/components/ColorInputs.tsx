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
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocalStorage } from "@uidotdev/usehooks";

interface ColorInputsProps {
  colors: string[];
  onColorChange: (index: number, color: string) => void;
}

export const ColorInputs: React.FC<ColorInputsProps> = ({
  colors,
  onColorChange,
}) => {
  const [isOpen, setIsOpen] = useLocalStorage("colorInputsOpen", true);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brush />
            Input Colors
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </CardTitle>
          <CardDescription>
            Add colors to generate palettes from.
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <Label
                    htmlFor={`color-${index}`}
                    className="text-sm font-medium"
                  >
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
