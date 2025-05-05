import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Color } from "@/types";
import { generateId } from "@/utils/helpers";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setInputColors } from "@/store/paletteSlice";
import { toggleColorInputsOpen } from "@/store/uiSlice";

export const ColorInput: React.FC = () => {
  const { colorInputsOpen: isOpen } = useAppSelector((state) => state.ui);

  const inputColors = useAppSelector((state) => state.palette.inputColors);
  const dispatch = useAppDispatch();
  const [newColor, setNewColor] = useState("#7B68EE");

  const handleColorChange = (id: string, value: string) => {
    const updatedColors = inputColors.map((color) =>
      color.id === id ? { ...color, value } : color
    );
    dispatch(setInputColors(updatedColors));
  };

  const handleAddColor = () => {
    const color: Color = {
      id: generateId(),
      value: newColor,
    };
    dispatch(setInputColors([...inputColors, color]));
    setNewColor("#7B68EE");
  };

  const handleRemoveColor = (id: string) => {
    if (inputColors.length > 1) {
      const updatedColors = inputColors.filter((color) => color.id !== id);
      dispatch(setInputColors(updatedColors));
    }
  };

  return (
    <Card>
      <Collapsible
        open={isOpen}
        onOpenChange={() => dispatch(toggleColorInputsOpen())}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {inputColors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={color.value}
                    onChange={(e) =>
                      handleColorChange(color.id, e.target.value)
                    }
                    className="w-12 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color.value}
                    onChange={(e) =>
                      handleColorChange(color.id, e.target.value)
                    }
                    className="flex-grow font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveColor(color.id)}
                    disabled={inputColors.length <= 1}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-12 h-10 p-1 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="flex-grow font-mono text-sm"
              />
              <Button onClick={handleAddColor} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
