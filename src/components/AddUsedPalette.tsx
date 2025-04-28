import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { Palette } from "@/types";
import { isColorDark } from "@/utils/colorUtils";

interface AddUsedPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  validColors: string[];
  paletteSize: number;
  onAddPalette: (palette: Palette) => void;
}

export function AddUsedPalette({
  isOpen,
  onClose,
  validColors,
  paletteSize,
  onAddPalette,
}: AddUsedPaletteProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedColors([]);
    }
  }, [isOpen]);

  const handleColorSelect = useCallback(
    (color: string) => {
      if (selectedColors.includes(color)) {
        setSelectedColors(selectedColors.filter((c) => c !== color));
      } else if (selectedColors.length < paletteSize) {
        setSelectedColors([...selectedColors, color]);
      } else {
        toast.error(`You can only select ${paletteSize} colors.`);
      }
    },
    [selectedColors, paletteSize]
  );

  const handleAddPalette = useCallback(() => {
    if (selectedColors.length !== paletteSize) {
      toast.error(`Please select exactly ${paletteSize} colors.`);
      return;
    }

    const newPalette: Palette = { colors: selectedColors, used: true };
    onAddPalette(newPalette);
    onClose();
  }, [selectedColors, paletteSize, onAddPalette, onClose]);

  if (!isOpen) {
    return null;
  }

  if (!isSmallDevice) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Colors for New Palette</DialogTitle>
            <DialogDescription>
              Choose {paletteSize} colors from the available options.
            </DialogDescription>
          </DialogHeader>
          <AddUsedPaletteForm
            validColors={validColors}
            selectedColors={selectedColors}
            handleColorSelect={handleColorSelect}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Select Colors for New Palette</DrawerTitle>
          <DrawerDescription>
            Choose {paletteSize} colors from the available options.
          </DrawerDescription>
        </DrawerHeader>
        <AddUsedPaletteForm
          validColors={validColors}
          selectedColors={selectedColors}
          handleColorSelect={handleColorSelect}
        />
        <DrawerFooter className="pt-2">
          <Button
            variant="default"
            onClick={handleAddPalette}
            disabled={selectedColors.length !== paletteSize}
          >
            Add Palette
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface AddUsedPaletteFormProps {
  validColors: string[];
  selectedColors: string[];
  handleColorSelect: (color: string) => void;
}

function AddUsedPaletteForm({
  validColors,
  selectedColors,
  handleColorSelect,
}: AddUsedPaletteFormProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4">
      {validColors.map((color) => (
        <Button
          key={color}
          className={`min-w-12 min-h-12 relative ${
            selectedColors.includes(color)
              ? "outline-2 outline-solid outline-border scale-105"
              : "outline-none opacity-100"
          }`}
          style={{
            backgroundColor: color,
          }}
          onClick={() => handleColorSelect(color)}
        >
          {selectedColors.includes(color) && (
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                isColorDark(color) ? "text-white" : "text-black"
              }`}
            >
              {selectedColors.indexOf(color) + 1}
            </div>
          )}
        </Button>
      ))}
    </div>
  );
}
