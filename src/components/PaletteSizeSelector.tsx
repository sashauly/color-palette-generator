import React, { useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setPaletteSize } from "@/store/paletteSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  togglePaletteSizeSelectorOpen,
  setPaletteSizeConfirmDialogOpen,
} from "@/store/uiSlice";
import PaletteSizeConfirmDialog from "./PaletteSizeConfirmDialog";

const MIN_PALETTE_SIZE = 2;
const MAX_PALETTE_SIZE = 6;

const PaletteSizeSelector: React.FC = () => {
  const {
    paletteSizeSelectorOpen: isCollapsibleOpen,
    paletteSizeConfirmDialogOpen: paletteSizeConfirmOpen,
  } = useAppSelector((state) => state.ui);
  const currentPaletteSize = useAppSelector(
    (state) => state.palette.paletteSize
  );
  const hasUsedPalettes = useAppSelector((state) =>
    state.palette.generatedPalettes.some((p) => p.used)
  );
  const dispatch = useAppDispatch();

  const [sliderValue, setSliderValue] = useState<number>(currentPaletteSize);

  const [pendingSize, setPendingSize] = useState<number | null>(null);

  useEffect(() => {
    setSliderValue(currentPaletteSize);
  }, [currentPaletteSize]);

  const handleSliderChange = useCallback(
    (value: number[]) => {
      const newSize = value[0];

      if (newSize !== currentPaletteSize) {
        if (hasUsedPalettes) {
          setSliderValue(newSize);
          setPendingSize(newSize);
          dispatch(setPaletteSizeConfirmDialogOpen(true));
        } else {
          dispatch(setPaletteSize(newSize));
          setSliderValue(newSize);
        }
      } else {
        setSliderValue(newSize);
      }
    },
    [currentPaletteSize, hasUsedPalettes, dispatch]
  );

  const handleConfirmChange = useCallback(() => {
    if (pendingSize !== null) {
      dispatch(setPaletteSize(pendingSize));
    }
    dispatch(setPaletteSizeConfirmDialogOpen(false));
    setPendingSize(null);
  }, [dispatch, pendingSize]);

  const handleCancelChange = useCallback(() => {
    dispatch(setPaletteSizeConfirmDialogOpen(false));
    setPendingSize(null);
    setSliderValue(currentPaletteSize);
  }, [currentPaletteSize, dispatch]);

  const handleConfirmDialogStateChange = useCallback(
    (open: boolean) => {
      if (!open && paletteSizeConfirmOpen) {
        handleCancelChange();
      }
    },
    [paletteSizeConfirmOpen, handleCancelChange]
  );

  return (
    <Card>
      <Collapsible
        open={isCollapsibleOpen}
        onOpenChange={() => dispatch(togglePaletteSizeSelectorOpen())}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Palette Size
            <span className="font-medium text-lg">{currentPaletteSize}</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </CardTitle>
          <CardDescription>
            The number of colors in each palette.
          </CardDescription>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            <Slider
              value={[sliderValue]}
              min={MIN_PALETTE_SIZE}
              max={MAX_PALETTE_SIZE}
              step={1}
              onValueChange={handleSliderChange}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              {Array.from(
                { length: MAX_PALETTE_SIZE - MIN_PALETTE_SIZE + 1 },
                (_, i) => i + MIN_PALETTE_SIZE
              ).map((size) => (
                <span key={size}>{size}</span>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <PaletteSizeConfirmDialog
        isOpen={paletteSizeConfirmOpen}
        onOpenChange={handleConfirmDialogStateChange}
        pendingSize={pendingSize}
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
      />
    </Card>
  );
};

export default PaletteSizeSelector;
