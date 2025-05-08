import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  addManualPalette,
  resetAddManualPaletteStatus,
} from "@/store/paletteSlice";
import { Plus } from "lucide-react";
import {
  setAddUsedPaletteDialogOpen,
  toggleAddUsedPaletteDialogOpen,
} from "@/store/uiSlice";

export function AddUsedPaletteDialog() {
  const { paletteSize, inputColors, addManualPaletteStatus } = useAppSelector(
    (state) => state.palette
  );
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

  useEffect(() => {
    switch (addManualPaletteStatus) {
      case "added":
        toast.success("Palette added successfully!");
        dispatch(setAddUsedPaletteDialogOpen(false));
        dispatch(resetAddManualPaletteStatus());
        break;
      case "exist":
      case "already_used":
        toast.info(
          addManualPaletteStatus === "exist"
            ? "Palette marked as used."
            : "Palette already being used."
        );
        dispatch(setAddUsedPaletteDialogOpen(false));
        dispatch(resetAddManualPaletteStatus());
        break;
      case "invalid":
        toast.error("Failed to add palette: Invalid colors or size.");
        dispatch(resetAddManualPaletteStatus());
        break;
      default:
        break;
    }
  }, [addManualPaletteStatus, dispatch]);

  const handleColorSelect = useCallback(
    (color: Color) => {
      if (selectedColors.find((c) => c.id === color.id)) {
        setSelectedColors(selectedColors.filter((c) => c.id !== color.id));
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
  }, [selectedColors, paletteSize, dispatch]);

  const handleRemoveColor = useCallback((colorToRemove: Color) => {
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.filter((c) => c.id !== colorToRemove.id)
    );
  }, []);

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
            inputColors={inputColors}
            selectedColors={selectedColors}
            handleColorSelect={handleColorSelect}
            handleRemoveColor={handleRemoveColor}
            paletteSize={paletteSize}
          />
          <DialogFooter>
            <Button
              variant="default"
              onClick={handleAddPalette}
              disabled={selectedColors.length < paletteSize}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Palette
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
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
          inputColors={inputColors}
          selectedColors={selectedColors}
          handleColorSelect={handleColorSelect}
          handleRemoveColor={handleRemoveColor}
          paletteSize={paletteSize}
        />
        <DrawerFooter className="pt-2">
          <Button
            variant="default"
            onClick={handleAddPalette}
            disabled={selectedColors.length < paletteSize}
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
  inputColors: Color[];
  selectedColors: Color[];
  handleColorSelect: (color: Color) => void;
  handleRemoveColor: (color: Color) => void;
  paletteSize: number;
}

function AddUsedPaletteForm({
  inputColors,
  selectedColors,
  handleColorSelect,
  handleRemoveColor,
  paletteSize,
}: AddUsedPaletteFormProps) {
  const labelColors = (color: string) => {
    const contrastBackgroundColor = getContrastColor(color);
    const contrastTextColor = getContrastColor(contrastBackgroundColor);

    return {
      backgroundColor: contrastBackgroundColor,
      color: contrastTextColor,
    };
  };

  const handleRemoveColorByIndex = useCallback(
    (index: number) => {
      const colorToRemove = selectedColors[index];
      if (colorToRemove) {
        handleRemoveColor(colorToRemove);
      } else {
        toast.error("No color at this position to remove");
      }
    },
    [selectedColors, handleRemoveColor]
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {inputColors.map((color) => (
          <Button
            key={color.id}
            className={`color-swatch min-w-8 min-h-8 rounded-full border border-border hover:scale-110 transition-transform
              ${
                selectedColors.find((c) => c.id === color.id)
                  ? "outline-2 outline-solid outline-border scale-105"
                  : "outline-none opacity-100"
              }`}
            style={{
              backgroundColor: color.value,
            }}
            onClick={() => handleColorSelect(color)}
            title={color.value}
          >
            {selectedColors.find((c) => c.id === color.id) && (
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                style={{ color: getContrastColor(color.value) }}
              >
                {selectedColors.findIndex((c) => c.id === color.id) + 1}
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
                key={color.id}
                className="flex-1 relative h-15 rounded-md border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: color.value }}
                onClick={() => handleRemoveColorByIndex(index)}
                title={`Click to remove ${color.value}`}
              >
                <span
                  className="absolute top-1 right-1 rounded-full h-4 w-4 text-xs flex items-center justify-center"
                  style={labelColors(color.value)}
                >
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center bg-muted/10 rounded-md mb-3">
            <p className="text-muted-foreground">
              Click on colors above to add them to your palette
            </p>
          </div>
        )}
      </div>
    </>
  );
}
