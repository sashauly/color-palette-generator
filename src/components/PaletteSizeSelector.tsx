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
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { togglePaletteSizeSelectorOpen } from "@/store/uiSlice";
import { useState, useEffect } from "react";

const MIN_PALETTE_SIZE = 2;
const MAX_PALETTE_SIZE = 6;

const PaletteSizeSelector = () => {
  const { paletteSizeSelectorOpen: isOpen } = useAppSelector(
    (state) => state.ui
  );
  const currentPaletteSize = useAppSelector(
    (state) => state.palette.paletteSize
  );
  const hasUsedPalettes = useAppSelector((state) =>
    state.palette.generatedPalettes.some((p) => p.used)
  );
  const dispatch = useAppDispatch();

  const [sliderValue, setSliderValue] = useState<number>(currentPaletteSize);

  useEffect(() => {
    setSliderValue(currentPaletteSize);
  }, [currentPaletteSize]);

  const handleChange = (value: number[]) => {
    const newSize = value[0];

    if (newSize !== currentPaletteSize) {
      if (hasUsedPalettes) {
        setSliderValue(newSize);
        if (
          window.confirm(
            "Changing the palette size will clear all generated palettes, including your marked palettes. Are you sure?"
          )
        ) {
          dispatch(setPaletteSize(newSize));
        } else {
          setSliderValue(currentPaletteSize);
        }
      } else {
        dispatch(setPaletteSize(newSize));
        setSliderValue(newSize);
      }
    } else {
      setSliderValue(newSize);
    }
  };

  return (
    <Card>
      <Collapsible
        open={isOpen}
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
              onValueChange={handleChange}
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
    </Card>
  );
};

export default PaletteSizeSelector;
