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

const MIN_PALETTE_SIZE = 2;
const MAX_PALETTE_SIZE = 6;

const PaletteSizeSelector = () => {
  const { paletteSizeSelectorOpen: isOpen } = useAppSelector(
    (state) => state.ui
  );
  const paletteSize = useAppSelector((state) => state.palette.paletteSize);
  const dispatch = useAppDispatch();

  const handleChange = (value: number[]) => {
    dispatch(setPaletteSize(value[0]));
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
            <span className="font-medium text-lg">{paletteSize}</span>
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
              defaultValue={[paletteSize]}
              value={[paletteSize]}
              min={MIN_PALETTE_SIZE}
              max={MAX_PALETTE_SIZE}
              step={1}
              onValueChange={handleChange}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              {Array.from(
                { length: MAX_PALETTE_SIZE - 1 },
                (_, i) => i + 2
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
