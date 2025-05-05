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
import type { Palette, Color } from "@/types";
import { generateId, getContrastColor } from "@/utils/helpers";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addManualPalette } from "@/store/paletteSlice";
import { Plus } from "lucide-react";
import {
  setAddUsedPaletteDialogOpen,
  toggleAddUsedPaletteDialogOpen,
} from "@/store/uiSlice";

export function AddUsedPaletteDialog() {
  const { paletteSize } = useAppSelector((state) => state.palette);
  const dispatch = useAppDispatch();
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);

  const { addUsedPaletteDialogOpen: isOpen } = useAppSelector(
    (state) => state.ui
  );

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    if (isOpen) {
      setSelectedColors([]);
    }
  }, [isOpen]);

  const handleColorSelect = useCallback(
    (color: Color) => {
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

    const newPalette: Palette = {
      id: generateId(),
      colors: selectedColors,
      used: true,
      createdAt: Date.now(),
    };
    dispatch(addManualPalette(newPalette));
    dispatch(setAddUsedPaletteDialogOpen(false));
  }, [selectedColors, paletteSize, dispatch]);

  if (!isOpen) return null;

  const handleRemoveColor = (index: number) => {
    if (selectedColors.length === 0) {
      toast.error("No colors to remove");
    }
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.filter((_, i) => i !== index)
    );
  };

  if (!isSmallDevice) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={() => dispatch(toggleAddUsedPaletteDialogOpen())}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Colors for New Palette</DialogTitle>
            <DialogDescription>
              Choose {paletteSize} colors from the available options.
            </DialogDescription>
          </DialogHeader>
          <AddUsedPaletteForm
            selectedColors={selectedColors}
            handleColorSelect={handleColorSelect}
            handleRemoveColor={handleRemoveColor}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={() => dispatch(toggleAddUsedPaletteDialogOpen())}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Select Colors for New Palette</DrawerTitle>
          <DrawerDescription>
            Choose {paletteSize} colors from the available options.
          </DrawerDescription>
        </DrawerHeader>
        <AddUsedPaletteForm
          selectedColors={selectedColors}
          handleColorSelect={handleColorSelect}
          handleRemoveColor={handleRemoveColor}
        />
        <DrawerFooter className="pt-2">
          <Button
            variant="default"
            onClick={handleAddPalette}
            disabled={selectedColors.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
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
  selectedColors: Color[];
  handleColorSelect: (color: Color) => void;
  handleRemoveColor: (index: number) => void;
}

function AddUsedPaletteForm({
  selectedColors,
  handleColorSelect,
  handleRemoveColor,
}: AddUsedPaletteFormProps) {
  const { inputColors, paletteSize } = useAppSelector((state) => state.palette);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {inputColors.map((color) => (
          <Button
            key={color.id}
            className={`color-swatch min-w-8 min-h-8 rounded-full border border-border hover:scale-110 transition-transform           
              ${
                selectedColors.includes(color)
                  ? "outline-2 outline-solid outline-border scale-105"
                  : "outline-none opacity-100"
              }`}
            style={{
              backgroundColor: color.value,
            }}
            onClick={() => handleColorSelect(color)}
            title={color.value}
          >
            {selectedColors.includes(color) && (
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${getContrastColor(
                  color.value
                )}`}
              >
                {selectedColors.indexOf(color) + 1}
              </div>
            )}
          </Button>
        ))}
      </div>

      <div className="p-4 border rounded-lg bg-card">
        <div className="mb-2 text-sm text-muted-foreground">
          Selected colors ({selectedColors.length}/{paletteSize}):
        </div>

        {selectedColors.length > 0 ? (
          <div className="flex mb-3">
            {selectedColors.map((color, index) => (
              <button
                key={index}
                className="flex-1 relative h-12"
                style={{ backgroundColor: color.value }}
                onClick={() => handleRemoveColor(index)}
                title="Click to remove"
              >
                <span
                  className="absolute top-1 right-1 rounded-full h-4 w-4 text-xs flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.7)",
                    color: "#000",
                  }}
                >
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-muted/10 rounded-md mb-3">
            <p className="text-muted-foreground">
              Click on colors above to add them to your palette
            </p>
          </div>
        )}
      </div>
    </>
  );
}
